const express = require('express');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { auth } = require('../middleware/auth');
const router = express.Router();

// --- WISHLIST ---

// GET /api/users/wishlist
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/users/wishlist/:productId
router.post('/wishlist/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const idx = user.wishlist.indexOf(req.params.productId);
    if (idx === -1) {
      user.wishlist.push(req.params.productId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();
    const populated = await User.findById(req.userId).populate('wishlist');
    res.json({ wishlist: populated.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// --- ADDRESSES ---

// GET /api/users/addresses
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/users/addresses
router.post('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { label, name, phone, city, address } = req.body;
    if (user.addresses.length === 0) req.body.isDefault = true;
    user.addresses.push(req.body);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// PUT /api/users/addresses/:addressId
router.put('/addresses/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ error: 'Ünvan tapılmadı' });
    Object.assign(addr, req.body);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses.pull(req.params.addressId);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// PUT /api/users/addresses/:addressId/default
router.put('/addresses/:addressId/default', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses.forEach(a => { a.isDefault = a._id.toString() === req.params.addressId; });
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// --- CARDS ---

// GET /api/users/cards
router.get('/cards', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ cards: user.cards });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/users/cards
router.post('/cards', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.cards.length === 0) req.body.isDefault = true;
    user.cards.push(req.body);
    await user.save();
    res.json({ cards: user.cards });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// DELETE /api/users/cards/:cardId
router.delete('/cards/:cardId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cards.pull(req.params.cardId);
    await user.save();
    res.json({ cards: user.cards });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// --- SUPPORT TICKETS ---

// GET /api/users/tickets
router.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/users/tickets
router.post('/tickets', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Mövzu və mesajı doldurun' });
    const ticket = await Ticket.create({ user: req.userId, subject, message });
    res.status(201).json({ ticket });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
