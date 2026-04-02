const express = require('express');
const User = require('../models/User');
const GuestCart = require('../models/GuestCart');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Synchronize cart (called implicitly by frontend when cart changes)
router.post('/sync', async (req, res) => {
  try {
    const { items, guestPhone, guestName } = req.body;
    let userId = null;

    // Optional auth extraction
    await new Promise(resolve => {
        auth(req, res, () => {
            if(req.user) userId = req.user.userId;
            resolve();
        });
    });

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        savedCart: items,
        lastCartUpdate: new Date()
      });
      return res.json({ success: true });
    } else if (guestPhone) {
      await GuestCart.findOneAndUpdate(
        { phone: guestPhone },
        { phone: guestPhone, name: guestName || '', items, lastCartUpdate: new Date() },
        { upsert: true, new: true }
      );
      return res.json({ success: true });
    }
    
    res.json({ success: false, reason: 'No tracker identity' });
  } catch (err) {
    console.error('Cart sync error:', err);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Admin Endpoint to get abandoned carts (older than X minutes or immediately)
router.get('/abandoned', adminAuth, async (req, res) => {
  try {
    // 5 minutes for demonstration (can be increased to 2 hours)
    const threshold = new Date(Date.now() - 5 * 60 * 1000); 

    // Find users with cart items updated before threshold
    const users = await User.find({
      'savedCart.0': { $exists: true },
      lastCartUpdate: { $lt: threshold }
    }).select('firstName lastName phone email savedCart lastCartUpdate');

    const guests = await GuestCart.find({
      'items.0': { $exists: true },
      lastCartUpdate: { $lt: threshold }
    });

    const combinedCarts = [
      ...users.map(u => ({
        type: 'user',
        _id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        phone: u.phone,
        email: u.email,
        items: u.savedCart,
        lastUpdate: u.lastCartUpdate
      })),
      ...guests.map(g => ({
        type: 'guest',
        _id: g._id,
        name: g.name || 'Qonaq (Anonim)',
        phone: g.phone,
        email: '',
        items: g.items,
        lastUpdate: g.lastCartUpdate
      }))
    ].sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

    res.json({ abandoned: combinedCarts });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
