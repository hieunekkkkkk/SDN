const mongoose = require('mongoose');

const ownerStackSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stack_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stack' },
  status: String // ENUM: active, disactive
});

module.exports = mongoose.model('OwnerStack', ownerStackSchema, 'owner_stack'); 