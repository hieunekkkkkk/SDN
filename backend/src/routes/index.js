const express = require('express');
const router = express.Router();
const homeRoutes = require('./home.route');
const redisRouter = require('./redisRouter');

// Tập trung các routes
router.use('/home', homeRoutes);
router.use('/redis', redisRouter);

module.exports = router;