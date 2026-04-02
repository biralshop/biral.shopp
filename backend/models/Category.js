const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'hidden'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
