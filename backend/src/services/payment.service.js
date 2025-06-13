const mongoose = require('mongoose');
const Payment = require('../entity/module/payment.model'); // Adjust path to your payment model
const Stack = require('../entity/module/stack.model');
const payOS = require('../utils/payos');



class PaymentService {
    async createPayment(stack_id, user_id) {
        if (!stack_id) throw new Error('Stack ID is required');
    
        const stack = await Stack.findById(stack_id);
        if (!stack) throw new Error('Stack not found');
    
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const timestamp = Date.now() % 1000000;
        const transactionId = Number(`${timestamp}${randomNum}`.slice(-9));
    
        const payment = new Payment({
          user_id,
          payment_amount: parseInt(stack.stack_price),
          payment_stack: stack_id,
          payment_date: new Date(),
          payment_status: 'pending',
          payment_method: 'payos',
          transaction_id: transactionId.toString()
        });
        await payment.save();
    
        const body = {
          orderCode: transactionId,
          amount: parseInt(stack.stack_price),
          description: `Thanh toan stack: ${stack.stack_name}`,
          returnUrl: `http://localhost:5173/payment/success`,
          cancelUrl: `http://localhost:5173/payment/cancel`,
          callbackUrl: `http://localhost:3000/api/payments/callback`
        };
    
        const response = await payOS.createPaymentLink(body);
        return {
          error: 0,
          message: 'Payment created',
          url: response.checkoutUrl,
          payment_id: payment._id
        };
      }
    
      async handlePaymentCallback(data) {
        if (!data.orderCode || !data.status) throw new Error('Invalid callback data');
    
        const payment = await Payment.findOne({ transaction_id: data.orderCode.toString() });
        if (!payment) throw new Error('Payment not found');
    
        // Update payment status based on PayOS response
        payment.payment_status = data.status === 'PAID' ? 'completed' : 'failed';
        payment.payment_date = new Date();
        await payment.save();
    
        // Log the callback for debugging
        console.log('Payment callback processed:', {
            orderCode: data.orderCode,
            status: data.status,
            payment_id: payment._id,
            payment_status: payment.payment_status
        });
    
        return {
            error: 0,
            message: 'Payment status updated successfully',
            data: {
                payment_status: payment.payment_status,
                payment_id: payment._id
            }
        };
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