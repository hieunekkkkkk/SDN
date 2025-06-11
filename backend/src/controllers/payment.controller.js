
const Payment = require('../entity/module/payment.model');
const Stack = require('../entity/module/stack.model');
const payOS = require("../utils/payos");

exports.getAll = async (req, res) => {
  try {
    const data = await Payment.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Payment.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPayment = async (req, res) => {
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
};

exports.paymentCallback = async (req, res) => {
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
