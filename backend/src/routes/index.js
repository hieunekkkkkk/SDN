const express = require('express');
const router = express.Router();

const businessRoutes = require('./business.routes');
const productRoutes = require('./product.routes');
const paymentRoutes = require('./payment.routes');
const stackRoutes = require('./stack.routes');
const categoryRoutes = require('./category.routes');
const feedbackRoutes = require('./feedback.routes');
// const redisRoutes = require('./redisRouter');

// Tập trung các routes

router.use('/business', businessRoutes);
router.use('/product', productRoutes);
router.use('/payment', paymentRoutes);
router.use('/stack', stackRoutes);
router.use('/category', categoryRoutes);
router.use('/feedback', feedbackRoutes);

// router.use('/redis', redisRoutes);

module.exports = router;
