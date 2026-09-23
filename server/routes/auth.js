import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'sneakerhead_jwt_fallback_secret_key_2026';

const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database is not connected. Please ensure your current IP address is whitelisted in MongoDB Atlas Network Access.'
    });
    return false;
  }
  return true;
};

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// @route   POST /api/auth/signup
// @desc    Register a new user (with already-exists detection)
router.post('/signup', async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;

    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (password.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be exactly 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        alreadyExists: true,
        message: 'An account with this email already exists. You can log in directly!'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, username: newUser.username },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during signup'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return token
router.post('/login', async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please sign up first!'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check and try again.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Welcome back!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user from token
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
