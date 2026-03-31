const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'replied', 'closed'], default: 'open' },
  reply: String,
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
