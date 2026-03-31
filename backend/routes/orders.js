const express = require('express');
const Order = require('../models/Order');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const router = express.Router();

const statusLabels = {
  pending: 'Gözləyir',
  processing: 'Hazırlanır',
  shipped: 'Yoldadır',
  delivered: 'Çatdırılıb',
  returned: 'Geri qaytarılıb',
};

const generateOrderNumber = () => `PT-${Math.floor(100000 + Math.random() * 900000)}`;

// POST /api/orders
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, address, deliveryMethod, paymentMethod, subtotal, shipping, discount, total, promoCode } = req.body;

    if (!items?.length || !address?.name || !address?.phone || !address?.address) {
      return res.status(400).json({ error: 'Tələb olunan sahələri doldurun' });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.userId || undefined,
      items,
      address,
      deliveryMethod,
      paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
      promoCode,
      status: 'pending',
      statusLabel: statusLabels.pending,
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/orders (user's orders)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.product');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderNumber: req.params.id }],
      user: req.userId,
    }).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Sifariş tapılmadı' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// PUT /api/orders/:id/status (Admin)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!statusLabels[status]) return res.status(400).json({ error: 'Yanlış status' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, statusLabel: statusLabels[status] },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Sifariş tapılmadı' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/orders/admin/all (Admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email')
      .populate('items.product');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
