const express = require('express');
const Article = require('../models/Article');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/articles (Public List)
router.get('/', async (req, res) => {
  try {
    const { status, limit } = req.query;
    const query = {};
    if (status) query.status = status;
    else query.status = 'active';

    let articlesQuery = Article.find(query).sort({ createdAt: -1 });
    if (limit) articlesQuery = articlesQuery.limit(parseInt(limit));

    const articles = await articlesQuery;
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// GET /api/articles/:slug (Public Detail)
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug, status: 'active' },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!article) return res.status(404).json({ error: 'Məqalə tapılmadı' });
    res.json({ article });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// POST /api/articles (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json({ article });
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ error: 'Xəta və ya eyni link mövcuddur' });
  }
});

// PUT /api/articles/:id (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ error: 'Məqalə tapılmadı' });
    res.json({ article });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// DELETE /api/articles/:id (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Məqalə silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

module.exports = router;
