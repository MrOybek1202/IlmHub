import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  displayId: { type: String, unique: true, sparse: true },
  password: { type: String }, // optional for Google Auth users
  name: { type: String, required: true },
  avatarUrl: { type: String },
  grade: { type: Number },
  goal: { type: String, enum: ['school', 'experiments', 'exam', 'games'] },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  verificationCode: { type: String }, // Temporarily store verification code
  verificationCodeExpires: { type: Date },
  googleId: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
