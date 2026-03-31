const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  image: String,
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String,
  items: [orderItemSchema],
  address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: String,
    postal: String,
    address: { type: String, required: true },
    notes: String,
  },
  deliveryMethod: { type: String, default: 'standard' },
  paymentMethod: { type: String, default: 'card' },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  promoCode: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'returned'],
    default: 'pending',
  },
  statusLabel: { type: String, default: 'Gözləyir' },
}, { timestamps: true });

orderSchema.index({ user: 1 });

module.exports = mongoose.model('Order', orderSchema);
