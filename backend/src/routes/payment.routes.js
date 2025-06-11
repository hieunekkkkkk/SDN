const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
// const authMiddleware = require('../middleware/authMiddleware');

// Get all payments
// // router.get('/', PaymentController.getAllPayments);

// // Get payment by ID
// router.get('/:id', PaymentController.getPaymentById);

// // Update payment
// router.put('/:id', PaymentController.updatePayment);

// // Delete payment
// router.delete('/:id', PaymentController.deletePayment);

// // Update transaction ID
// router.patch('/:id/transaction', PaymentController.updateTransactionId);

router.post('/callback', PaymentController.paymentCallback);

router.post('/', PaymentController.createPayment);

module.exports = router;
