const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');
const businessRoutes = require('./business.routes');
const productRoutes = require('./product.routes');
const paymentRoutes = require('./payment.routes');
const stackRoutes = require('./stack.routes');
const ownerStackRoutes = require('./owner_stack.routes');
const categoryRoutes = require('./category.routes');
const feedbackBusinessRoutes = require('./feedback_business.routes');
const feedbackProductRoutes = require('./feedback_product.routes');

// Tập trung các routes
router.use('/users', userRoutes);
router.use('/business', businessRoutes);
router.use('/product', productRoutes);
router.use('/payment', paymentRoutes);
router.use('/stack', stackRoutes);
router.use('/owner-stack', ownerStackRoutes);
router.use('/category', categoryRoutes);
router.use('/feedback-business', feedbackBusinessRoutes);
router.use('/feedback-product', feedbackProductRoutes);

module.exports = router;