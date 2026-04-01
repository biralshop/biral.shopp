const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendVerificationEmail } = require('../services/email');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, username, phone, password } = req.body;

    // Check if email exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: 'Bu email artıq qeydiyyatdan keçib' });
    }

    // Check if username exists
    if (username) {
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(400).json({ error: 'Bu istifadəçi adı artiq istifadə olunur' });
      }
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username: username ? username.toLowerCase() : undefined,
      phone: phone || '',
      password,
      emailVerified: false,
    });
    await user.save();

    // Generate OTP and send email
    const code = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      code,
      type: 'email_verify',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    await sendVerificationEmail(email, code);

    // Generate token (limited until verified)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: user.toSafeJSON(),
      message: 'Hesab yaradıldı! Email-ə təsdiq kodu göndərildi.',
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Qeydiyyat zamanı xəta baş verdi' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'İstifadəçi tapılmadı' });

    if (user.emailVerified) {
      return res.json({ message: 'Email artıq təsdiqlənib', verified: true });
    }

    const otp = await OTP.findOne({
      email: user.email,
      code,
      type: 'email_verify',
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return res.status(400).json({ error: 'Kod yanlışdır və ya müddəti bitib' });
    }

    user.emailVerified = true;
    await user.save();
    await OTP.deleteMany({ email: user.email, type: 'email_verify' });

    res.json({ message: 'Email uğurla təsdiqləndi!', verified: true, user: user.toSafeJSON() });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Təsdiqləmə zamanı xəta baş verdi' });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'İstifadəçi tapılmadı' });

    // Rate limit: max 1 per 60 seconds
    const recent = await OTP.findOne({
      email: user.email,
      type: 'email_verify',
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });
    if (recent) {
      return res.status(429).json({ error: '60 saniyə gözləyin, sonra yenidən cəhd edin' });
    }

    const code = generateOTP();
    await OTP.create({
      email: user.email,
      code,
      type: 'email_verify',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerificationEmail(user.email, code);
    res.json({ message: 'Yeni kod göndərildi!' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Kod göndərilə bilmədi' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Login with email OR username
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
      ],
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email/istifadəçi adı və ya şifrə yanlışdır' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // If email not verified, send new OTP and require verification
    if (!user.emailVerified) {
      const code = generateOTP();
      await OTP.deleteMany({ email: user.email, type: 'email_verify' });
      await OTP.create({
        email: user.email,
        code,
        type: 'email_verify',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
      await sendVerificationEmail(user.email, code);

      return res.json({
        token,
        user: user.toSafeJSON(),
        requiresVerification: true,
        message: 'Email təsdiqlənməyib. Yeni kod göndərildi.',
      });
    }

    res.json({
      token,
      user: user.toSafeJSON(),
      requiresVerification: false,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Giriş zamanı xəta baş verdi' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
    res.json({ user: user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Serverdə xəta' });
  }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, deliveryNote, username } = req.body;
    const update = {};
    if (firstName) update.firstName = firstName;
    if (lastName) update.lastName = lastName;
    if (phone !== undefined) update.phone = phone;
    if (deliveryNote !== undefined) update.deliveryNote = deliveryNote;

    if (username) {
      const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: req.userId } });
      if (existing) return res.status(400).json({ error: 'Bu istifadəçi adı artıq istifadə olunur' });
      update.username = username.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    res.json({ user: user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Profil yenilənə bilmədi' });
  }
});

module.exports = router;
