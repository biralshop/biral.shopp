const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  verifiedPhone: { type: String, default: '' },
  deliveryNote: { type: String },
  savedCart: [{
    productId: String,
    quantity: Number,
    price: Number,
    productTitle: String
  }],
  lastCartUpdate: { type: Date },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [{
    label: String,
    name: String,
    phone: String,
    city: String,
    address: String,
    isDefault: { type: Boolean, default: false },
  }],
  cards: [{
    cardNumber: String,
    cardHolder: String,
    expiry: String,
    brand: String,
    isDefault: { type: Boolean, default: false },
  }],
  notifications: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    campaigns: { type: Boolean, default: false },
    oneClick: { type: Boolean, default: true },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
