const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  category_name: String
});

module.exports = mongoose.model('Category', categorySchema, 'category'); 