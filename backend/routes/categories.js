const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find();
    
    // Auto-migration for legacy dynamic categories
    if (categories.length === 0) {
      const dynamicCategories = await Product.aggregate([
        { $group: { _id: '$categorySlug', title: { $first: '$category' } } }
      ]);
      const newCats = dynamicCategories.filter(c => c._id && c.title).map(c => ({
        name: c.title,
        slug: c._id,
        status: 'active'
      }));
      if (newCats.length > 0) {
        categories = await Category.insertMany(newCats);
      }
    }

    // Add count dynamically
    const counts = await Product.aggregate([
      { $group: { _id: '$categorySlug', count: { $sum: 1 } } }
    ]);
    const countMap = counts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

    const result = categories.map(c => ({
      _id: c._id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '',
      status: c.status,
      productCount: countMap[c.slug] || 0
    }));

    res.json({ categories: result });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/categories (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ error: 'Xəta və ya eyni slug mövcuddur' });
  }
});

// PUT /api/categories/:id (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Kateqoriya tapılmadı' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kateqoriya silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
