const paymentService = require('../services/payment.service');
const payOS = require("../utils/payos");

class PaymentController {
    async createPayment(req, res) {
        try {
        const { stack_id } = req.body;
        
        // Validate stack_id
        if (!stack_id) {
            return res.status(400).json({
                error: 1,
                message: "Stack ID is required"
            });
        }

        // Get stack information
        const stack = await Stack.findById(stack_id);
        if (!stack) {
            return res.status(404).json({
                error: 1,
                message: "Stack not found"
            });
        }

        // Generate transaction ID (order code)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
        const timestamp = Date.now() % 1000000;
        const transactionId = Number(`${timestamp}${randomNum}`.slice(-9));

        // Create payment record in DB
        const payment = new Payment({
            user_id: req.user._id, // Assuming you have user info in request
            payment_amount: stack.stack_price,
            payment_stack: stack_id,
            payment_date: new Date(),
            payment_status: 'pending',
            payment_method: 'payos',
            transaction_id: transactionId.toString()
        });
        await payment.save();

        // Create PayOS payment link
    const body = {
            orderCode: transactionId,
            amount: stack.stack_price,
            description: `Thanh toan stack: ${stack.stack_name}`,
            returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
            cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`
    };

        const paymentLinkResponse = await payOS.createPaymentLink(body);
        
        res.json({
            error: 0,
            message: "ok",
            url: paymentLinkResponse.checkoutUrl,
            payment_id: payment._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 1,
            message: "Something went wrong"
        });
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

    async paymentCallback(req,res) => {
         try {
        const { orderCode, status } = req.body;
        
        // Find payment by transaction_id
        const payment = await Payment.findOne({ transaction_id: orderCode.toString() });
        if (!payment) {
            return res.status(404).json({
                error: 1,
                message: "Payment not found"
            });
        }

        // Update payment status
        payment.payment_status = status === 'PAID' ? 'completed' : 'failed';
        await payment.save();

        // Log the callback for debugging
        console.log('Payment callback received:', {
            orderCode,
            status,
            payment_id: payment._id
        });

        res.json({
            error: 0,
            message: "Payment status updated successfully"
        });
    } catch (error) {
        console.error('Payment callback error:', error);
        res.status(500).json({
            error: 1,
            message: "Failed to process payment callback"
        });
    }
}
// Export a single instance of the controller
module.exports = new PaymentController();