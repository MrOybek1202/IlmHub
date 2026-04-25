import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import axios from 'axios';

const router = express.Router();

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const verificationStore = new Map();

function normalizeDisplayId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

async function buildUniqueDisplayId(name, email) {
  const baseSource = name || email?.split("@")[0] || "user";
  const base = normalizeDisplayId(baseSource) || "user";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${Math.random().toString(36).slice(2, 6)}`;
    const candidate = `${base}${suffix}`;
    const exists = await User.exists({ displayId: candidate });
    if (!exists) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function setVerification(email, code) {
  verificationStore.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
}

function getVerification(email, code) {
  const entry = verificationStore.get(email);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    verificationStore.delete(email);
    return null;
  }
  if (code && entry.code !== code) return null;
  return entry;
}

function clearVerification(email) {
  verificationStore.delete(email);
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const verification = getVerification(email);
    if (!verification) return res.status(400).json({ message: "Avval email tasdiqlash kodini oling" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Foydalanuvchi allaqachon mavjud' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const displayId = await buildUniqueDisplayId(name, email);
    user = new User({ email, password: hashedPassword, name, displayId });
    await user.save();
    clearVerification(email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name, xp: user.xp, level: user.level, streak: user.streak }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: 'Email yoki parol noto\'g\'ri' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email yoki parol noto\'g\'ri' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, xp: user.xp, level: user.level, streak: user.streak }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email kiritilishi shart" });
    const code = generateCode();
    setVerification(email, code);

    // Send via EmailJS (using variables from .env)
    const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = process.env.VITE_EMAILJS_RESET_TEMPLATE_ID; // or SIGNUP_TEMPLATE_ID
    const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.VITE_EMAILJS_PRIVATE_KEY;

    try {
      await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: email,
          user_email: email,
          email: email,
          verification_code: code,
          code: code,
          message: `Sizning tasdiqlash kodingiz: ${code}`
        }
      });
      res.json({ ok: true });
    } catch (emailError) {
      console.error('EmailJS Error:', emailError.response?.data || emailError.message);
      res.status(500).json({ 
        message: 'Email yuborishda xatolik yuz berdi', 
        error: emailError.response?.data || emailError.message 
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const verification = getVerification(email, code);

    if (!verification) {
      return res.status(400).json({ ok: false, message: 'Kod noto\'g\'ri yoki yaroqlilik muddati tugagan' });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const verification = getVerification(email, code);
    const user = await User.findOne({ email });

    if (!verification) return res.status(400).json({ ok: false, message: 'Kod noto\'g\'ri yoki yaroqlilik muddati tugagan' });
    if (!user) return res.status(400).json({ ok: false, message: 'Kod noto\'g\'ri yoki yaroqlilik muddati tugagan' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    clearVerification(email);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { idToken, accessToken } = req.body;
    let email, name, sub;

    if (accessToken) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await response.json();
      if (!data.email) return res.status(400).json({ message: 'Yaroqsiz token' });
      email = data.email;
      name = data.name;
      sub = data.sub;
    } else if (idToken) {
      const decoded = jwt.decode(idToken);
      if (!decoded || !decoded.email) return res.status(400).json({ message: 'Yaroqsiz token' });
      email = decoded.email;
      name = decoded.name;
      sub = decoded.sub;
    } else {
      return res.status(400).json({ message: 'Token topilmadi' });
    }
    
    let user = await User.findOne({ email });
    if (!user) {
      const displayId = await buildUniqueDisplayId(name, email);
      user = new User({ email, name: name || 'Google User', googleId: sub, displayId });
      await user.save();
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, xp: user.xp, level: user.level, streak: user.streak }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
