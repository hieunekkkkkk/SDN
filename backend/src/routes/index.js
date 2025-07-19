const express = require('express');
const router = express.Router();

const businessRoutes = require('./business.routes');
const productRoutes = require('./product.routes');
const paymentRoutes = require('./payment.routes');
const stackRoutes = require('./stack.routes');
const categoryRoutes = require('./category.routes');
const feedbackRoutes = require('./feedback.routes');
const userRoutes = require('./user.routes');
const aiRoutes = require('./ai.routes');
const authRoutes = require('./auth');
// const redisRoutes = require('./redisRouter');

// Tập trung các routes

router.use('/businesses', businessRoutes);
router.use('/products', productRoutes);
router.use('/payments', paymentRoutes);
router.use('/stacks', stackRoutes);
router.use('/categories', categoryRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
router.use('/auth', authRoutes);

// router.use('/redis', redisRoutes);

module.exports = router;
