const express = require('express');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, badge, sort, limit } = req.query;
    const filter = {};

    if (category) filter.categorySlug = category;
    if (badge) filter.badge = badge;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (search) filter.$text = { $search: search };

    let query = Product.find(filter);

    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 });

    if (limit) query = query.limit(Number(limit));

    const products = await query;
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$categorySlug', title: { $first: '$category' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const icons = { metbex: '🔍', baxca: '🌿', heyet: '🏠', masin: '🚗', viral: '🔥' };
    const result = categories.map(c => ({
      slug: c._id,
      title: c.title,
      icon: icons[c._id] || '📦',
      productCount: c.count,
      description: `${c.title} kateqoriyasında ${c.count} məhsul`,
    }));
    res.json({ categories: result });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Məhsul tapılmadı' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/products (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Məhsul tapılmadı' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Məhsul silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
