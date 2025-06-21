const paymentService = require('../services/payment.service');
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev' });

class PaymentController {
    async createPayment(req, res) {
        try {
            const { stack_id, user_id } = req.body;


            const result = await paymentService.createPayment(stack_id, user_id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Create Payment Error:', error);
            res.status(500).json({ error: 1, message: error.message });
        }
    }

    async handlePaymentCallback(req, res) {
        try {
            const { orderCode, paymentStatus, transactionId } = req.query;
            if (!orderCode || !paymentStatus || !transactionId) {
                return res.status(400).json({ error: 1, message: 'Missing required parameters' });
            }

            const payment = await paymentService.getPaymentByOrderCode(orderCode);
            if (!payment) {
                return res.status(404).json({ error: 1, message: 'Payment not found' });
            }

            payment.payment_status = paymentStatus === '1' ? 'completed' : 'failed';
            payment.transaction_id = transactionId;
            await payment.save();

            res.status(200).json({ error: 0, message: 'Payment status updated' });
        } catch (error) {
            res.status(500).json({ error: 1, message: error.message });
        }
    }

    async getAllPayments(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await paymentService.getAllPayments(parseInt(page), parseInt(limit));
            res.status(200).json({ message: 'Payments retrieved successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPaymentById(req, res) {
        try {
            const payment = await paymentService.getPaymentById(req.params.id);
            res.status(200).json({ message: 'Payment retrieved successfully', data: payment });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async updatePayment(req, res) {
        try {
            const payment = await paymentService.updatePayment(req.params.id, req.body);
            res.status(200).json({ message: 'Payment updated successfully', data: payment });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deletePayment(req, res) {
        try {
            const payment = await paymentService.deletePayment(req.params.id);
            res.status(200).json({ message: 'Payment deleted successfully', data: payment });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async updateTransactionId(req, res) {
        try {
            const { transaction_id } = req.body;
            if (!transaction_id) {
                return res.status(400).json({ message: 'Transaction ID is required' });
            }
            const payment = await paymentService.updateTransactionId(req.params.id, transaction_id);
            res.status(200).json({ message: 'Transaction ID updated successfully', data: payment });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPaymentStatus(req, res) {
        try {
            const { user_id } = req.query;
            if (!user_id) {
                return res.status(400).json({ error: 1, message: 'User ID is required' });
            }
            const result = await paymentService.getPaymentStatus(user_id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 1, message: error.message });
        }
    }
}

// Export a single instance of the controller
module.exports = new PaymentController();