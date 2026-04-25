import axios from 'axios'
import bcrypt from 'bcryptjs'
import express from 'express'
import https from 'https'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

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

function buildFullName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

function splitName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' '),
  };
}

function formatUser(user) {
  const firstName = user.firstName || '';
  const lastName  = user.lastName  || '';
  return {
    id: user._id.toString(),
    email: user.email,
    firstName,
    lastName,
    name: [firstName, lastName].filter(Boolean).join(' ').trim() || user.email,
    avatarUrl: user.avatarUrl || '',
    grade: user.grade,
    goal: user.goal,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    createdAt: user.createdAt,
  };
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const verification = getVerification(email);
    if (!verification) return res.status(400).json({ message: "Avval email tasdiqlash kodini oling" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Foydalanuvchi allaqachon mavjud' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { firstName, lastName } = splitName(name);
    const displayId = await buildUniqueDisplayId(firstName + ' ' + lastName, email);
    user = new User({ email, password: hashedPassword, firstName, lastName, displayId });
    await user.save();
    clearVerification(email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: formatUser(user), token });
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
    res.json({ user: formatUser(user), token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email kiritilishi shart" });
    const code = generateCode();

    // Send via EmailJS (using variables from .env)
    // Choose template based on type if provided, otherwise default to signup
    const { type } = req.body;
    let templateId = process.env.VITE_EMAILJS_SIGNUP_TEMPLATE_ID;
    if (type === 'reset' && process.env.VITE_EMAILJS_RESET_TEMPLATE_ID) {
      templateId = process.env.VITE_EMAILJS_RESET_TEMPLATE_ID;
    } else if (!templateId) {
      templateId = process.env.VITE_EMAILJS_RESET_TEMPLATE_ID;
    }

    const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.VITE_EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.error('EmailJS Config Missing:', { 
        serviceId: !!serviceId, 
        templateId: !!templateId, 
        publicKey: !!publicKey, 
        privateKey: !!privateKey 
      });
      return res.status(500).json({ 
        message: 'Email xizmati sozlanmagan (VITE_EMAILJS_ variables missing in .env)', 
      });
    }

    const emailPayload = JSON.stringify({
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

    // Use Buffer.byteLength for correct Content-Length with UTF-8
    const byteLength = Buffer.byteLength(emailPayload, 'utf8');

    console.log(`[EmailJS] Sending to ${email} | service=${serviceId} | template=${templateId}`);

    const options = {
      hostname: 'api.emailjs.com',
      port: 443,
      path: '/api/v1.0/email/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': byteLength,
        'Origin': 'http://localhost:5000'
      }
    };

    return new Promise((resolve) => {
      const reqEmail = https.request(options, (emailRes) => {
        let resData = '';
        emailRes.on('data', (chunk) => { resData += chunk; });
        emailRes.on('end', () => {
          console.log(`[EmailJS] Response: ${emailRes.statusCode} | ${resData}`);
          if (emailRes.statusCode >= 200 && emailRes.statusCode < 300) {
            setVerification(email, code);
            res.json({ ok: true });
          } else {
            res.status(500).json({
              message: 'Email yuborishda xatolik yuz berdi',
              error: resData || `EmailJS status ${emailRes.statusCode}`
            });
          }
          resolve();
        });
      });

      reqEmail.on('error', (e) => {
        console.error('[EmailJS] Connection error:', e.message);
        res.status(500).json({
          message: 'Email yuborishda ulanish xatosi',
          error: e.message
        });
        resolve();
      });

      reqEmail.setTimeout(15000, () => {
        reqEmail.destroy(new Error('timeout'));
      });

      reqEmail.write(emailPayload, 'utf8');
      reqEmail.end();
    });

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
      try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = response.data;
        if (!data.email) return res.status(400).json({ message: 'Yaroqsiz token (Email topilmadi)' });
        email = data.email;
        name = data.name;
        sub = data.sub;
      } catch (error) {
        console.error('Google Access Token Error:', error.response?.data || error.message);
        return res.status(400).json({ message: 'Yaroqsiz access token', error: error.response?.data || error.message });
      }
    } else if (idToken) {
      try {
        const decoded = jwt.decode(idToken);
        if (!decoded || !decoded.email) {
          return res.status(400).json({ message: 'Yaroqsiz ID token' });
        }
        email = decoded.email;
        name = decoded.name;
        sub = decoded.sub;
      } catch (error) {
        return res.status(400).json({ message: 'Yaroqsiz ID token', error: error.message });
      }
    } else {
      return res.status(400).json({ message: 'Token topilmadi' });
    }
    
    let user = await User.findOne({ email });
    if (!user) {
      const parsedName = splitName(name || 'Google User');
      const displayId = await buildUniqueDisplayId(parsedName.firstName + ' ' + parsedName.lastName, email);
      user = new User({
        email,
        firstName: parsedName.firstName,
        lastName: parsedName.lastName,
        googleId: sub,
        displayId
      });
      await user.save();
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: formatUser(user), token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
