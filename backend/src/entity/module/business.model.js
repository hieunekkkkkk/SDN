const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner_id: { 
    type: mongoose.Schema.Types.Mixed,  // Cho phép cả ObjectId và String
    ref: 'User' 
  },
  business_name: String,
  business_address: String,
  business_location: {
    latitude: Number,
    longitude: Number
  },
  business_category: String,
  business_detail: String,
  business_time: {
    open: String,
    close: String
  },
  business_phone: String,
  business_status: Boolean,
  business_rating: Number,
  business_view: Number,
  business_image: [String],
  business_product: Number,
  business_active: Boolean
});

module.exports = mongoose.model('Business', businessSchema, 'business'); 