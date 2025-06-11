const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_id: String, // Cho phép cả ObjectId và String
  payment_amount: Number,
  payment_stack: { type: mongoose.Schema.Types.ObjectId, ref: 'stack' },
  payment_date: { type: Date, default: Date.now },
  payment_number: Number,
  transaction_id: String,
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  payment_method: String
});

module.exports = mongoose.model('payment', paymentSchema);