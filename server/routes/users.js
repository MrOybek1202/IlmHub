import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

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
    
    // Remap _id to id for frontend compatibility
    const userData = { id: user._id.toString(), email: user.email, name: user.name, xp: user.xp, level: user.level, streak: user.streak, avatarUrl: user.avatarUrl, grade: user.grade, goal: user.goal };
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json({ id: user._id.toString(), email: user.email, name: user.name, xp: user.xp, level: user.level, streak: user.streak, avatarUrl: user.avatarUrl, grade: user.grade, goal: user.goal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
