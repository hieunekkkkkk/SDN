const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');

// Tập trung các routes
router.use('/users', userRoutes);

module.exports = router;