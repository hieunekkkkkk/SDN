const paymentService = require('../services/payment.service');

class PaymentController {
    async createPayment(req, res) {
        try {
            const payment = await paymentService.createPayment(req.body);
            res.status(201).json({ message: 'Payment created successfully', data: payment });
        } catch (error) {
            res.status(400).json({ message: error.message });
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
}

// Export a single instance of the controller
module.exports = new PaymentController();
