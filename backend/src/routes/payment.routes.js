const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/authMiddleware');
// Create a new payment
router.post('/', PaymentController.createPayment);

router.get('/callback', PaymentController.handlePaymentCallback);

// Get all payments
router.get('/', PaymentController.getAllPayments);

// Get payment by ID
router.get('/:id', PaymentController.getPaymentById);

// Update payment
router.put('/:id', PaymentController.updatePayment);

// Delete payment
router.delete('/:id', PaymentController.deletePayment);

// Update transaction ID
router.patch('/:id/transaction', PaymentController.updateTransactionId);

// Search by user_id
router.get('/userid/:user_id', PaymentController.getPaymentsByUserId);

module.exports = router;