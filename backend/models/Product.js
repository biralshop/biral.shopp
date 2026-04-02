const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: Number },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  badge: { type: String, enum: ['new', 'viral', 'trend', 'campaign', null] },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  variants: [{ type: String }],
  features: [{ type: String }],
  weight: { type: Number, default: 0.5 }, // kg
  width: { type: Number, default: 10 }, // cm
  length: { type: Number, default: 10 }, // cm
  height: { type: Number, default: 10 }, // cm
  shippingPrice: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', category: 'text' });
productSchema.index({ categorySlug: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
