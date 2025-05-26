const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payment_amount: Number,
  payment_stack: { type: mongoose.Schema.Types.ObjectId, ref: 'Stack' },
  payment_date: Date,
  payment_number: Number,
  payment_status: String, // ENUM: pending, completed, failed
  payment_method: String  // ENUM: momo, zalopay
});

module.exports = mongoose.model('Payment', paymentSchema, 'payment'); 