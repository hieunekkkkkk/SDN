const mongoose = require('mongoose');
const Payment = require('../entity/module/payment.model'); // Adjust path to your payment model

class PaymentService {
    async createPayment(paymentData) {
        try {
            if (paymentData.payment_stack) {
                paymentData.payment_stack = new mongoose.Types.ObjectId(paymentData.payment_stack);
            }
            const payment = new Payment(paymentData);
            return await payment.save();
        } catch (error) {
            throw new Error(`Error creating payment: ${error.message}`);
        }
    }

    async getAllPayments(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const payments = await Payment.find()
                .skip(skip)
                .limit(limit)
                .populate('payment_stack', 'stack_name');
            const total = await Payment.countDocuments();
            return {
                payments,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                totalItems: total
            };
        } catch (error) {
            throw new Error(`Error fetching payments: ${error.message}`);
        }
    }


    async getPaymentById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid payment ID');
            }
            const payment = await Payment.findById(id)
                .populate('payment_stack', 'stack_name');
            if (!payment) {
                throw new Error('Payment not found');
            }
            return payment;
        } catch (error) {
            throw new Error(`Error fetching payment: ${error.message}`);
        }
    }

    async updatePayment(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid payment ID');
            }
            if (updateData.payment_stack) {
                updateData.payment_stack = new mongoose.Types.ObjectId(updateData.payment_stack);
            }
            const payment = await Payment.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!payment) {
                throw new Error('Payment not found');
            }
            return payment;
        } catch (error) {
            throw new Error(`Error updating payment: ${error.message}`);
        }
    }

    async deletePayment(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid payment ID');
            }
            const payment = await Payment.findByIdAndDelete(id);
            if (!payment) {
                throw new Error('Payment not found');
            }
            return payment;
        } catch (error) {
            throw new Error(`Error deleting payment: ${error.message}`);
        }
    }

    async updateTransactionId(id, transactionId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid payment ID');
            }
            const payment = await Payment.findByIdAndUpdate(
                id,
                { transaction_id: transactionId },
                { new: true, runValidators: true }
            );
            if (!payment) {
                throw new Error('Payment not found');
            }
            return payment;
        } catch (error) {
            throw new Error(`Error updating transaction ID: ${error.message}`);
        }
    }
}

// Export a single instance of the service
module.exports = new PaymentService();