const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ error: 'Bütün sahələri doldurun' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Şifrə minimum 6 simvol olmalıdır' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Bu email artıq istifadə olunur' });
    }

    const user = await User.create({ firstName, lastName, email, phone, password });
    const token = generateToken(user._id);

    res.status(201).json({ user: user.toSafeJSON(), token });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email və şifrəni daxil edin' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email və ya şifrə yanlışdır' });
    }

    const token = generateToken(user._id);
    res.json({ user: user.toSafeJSON(), token });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, deliveryNote, notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, phone, deliveryNote, notifications },
      { new: true }
    );
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
