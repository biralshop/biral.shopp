const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'hidden'], default: 'active' },
  author: { type: String, default: 'Admin' },
  relatedProducts: [{ type: String }], // Array of product slugs
}, { timestamps: true });

articleSchema.index({ title: 'text', excerpt: 'text' });
articleSchema.index({ slug: 1 });

module.exports = mongoose.model('Article', articleSchema);
