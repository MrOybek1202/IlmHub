import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

function getFullName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || 'User';
}

function formatUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: getFullName(user),
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    avatarUrl: user.avatarUrl || '',
    grade: user.grade,
    goal: user.goal,
    subjectProgress: user.subjectProgress || {},
    createdAt: user.createdAt,
  };
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const allowed = ['firstName', 'lastName', 'avatarUrl', 'grade', 'goal'];
    const patch = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );

    // Clean up string fields
    if (patch.firstName !== undefined) patch.firstName = String(patch.firstName).trim();
    if (patch.lastName !== undefined)  patch.lastName  = String(patch.lastName).trim();
    if (patch.avatarUrl !== undefined) patch.avatarUrl = String(patch.avatarUrl).trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: patch },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(formatUser(user));
  } catch (err) {
    console.error('PATCH /me error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const { subjectId, progress } = req.body;
    if (!subjectId) return res.status(400).json({ message: 'Subject ID required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.subjectProgress) user.subjectProgress = new Map();
    user.subjectProgress.set(subjectId, progress);

    await user.save();
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
