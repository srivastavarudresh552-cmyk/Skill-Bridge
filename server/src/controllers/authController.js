const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Name, email, and password must all be provided as text' } });
    }
    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ error: { code: 'INVALID_NAME', message: 'Name must be 2-50 characters' } });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: { code: 'INVALID_EMAIL', message: 'A valid email is required' } });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 8 characters' } });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists' } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong during signup' } });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: 'Email and password are required' } });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong during login' } });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    return res.status(200).json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error('GetMe error:', error.message);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

module.exports = { signup, login, getMe };