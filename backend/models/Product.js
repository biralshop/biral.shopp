const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  badge: { type: String, enum: ['new', 'viral', 'trend', 'campaign', null] },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  variants: [{ type: String }],
  features: [{ type: String }],
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', category: 'text' });
productSchema.index({ categorySlug: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
