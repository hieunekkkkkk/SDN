const mongoose = require('mongoose');

const feedbackBusinessSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  type: String, // ENUM: business, product
  comment: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: Boolean
});

module.exports = mongoose.model('FeedbackBusiness', feedbackBusinessSchema, 'feedback_business'); 