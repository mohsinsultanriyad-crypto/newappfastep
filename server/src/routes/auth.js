import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[LOGIN] Received email:', email);
  const user = await User.findOne({ email });
  console.log('[LOGIN] User found:', !!user);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  console.log('[LOGIN] Password match:', isMatch);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// POST /api/register (optional, only if UI needs it)
// router.post('/register', ...)

export default router;
