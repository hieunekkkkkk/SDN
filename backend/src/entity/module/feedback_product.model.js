const mongoose = require('mongoose');

const feedbackProductSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  type: String, // ENUM: business, product
  comment: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: Boolean
});

module.exports = mongoose.model('FeedbackProduct', feedbackProductSchema, 'feedback_product'); 