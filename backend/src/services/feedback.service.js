const FeedbackBusiness = require('../entity/module/feedback_business.model');
const FeedbackProduct = require('../entity/module/feedback_product.model');
const Business = require('../entity/module/business.model');
const Product = require('../entity/module/product.model');

class FeedbackService {
    // Business Feedback
    async createBusinessFeedback(data) {
        const feedback = new FeedbackBusiness(data);
        await feedback.save();
        
        // Cập nhật rating của business
        await this.updateBusinessRating(data.business_id);
        
        return feedback;
    }

    async getBusinessFeedbacks(businessId) {
        return await FeedbackBusiness.find({ business_id: businessId });
    }

    async updateBusinessFeedback(id, data) {
        const feedback = await FeedbackBusiness.findByIdAndUpdate(id, data, { new: true });
        if (feedback) {
            await this.updateBusinessRating(feedback.business_id);
        }
        return feedback;
    }

    async deleteBusinessFeedback(id) {
        const feedback = await FeedbackBusiness.findById(id);
        if (feedback) {
            await FeedbackBusiness.findByIdAndDelete(id);
            await this.updateBusinessRating(feedback.business_id);
        }
        return feedback;
    }

    // Product Feedback
    async createProductFeedback(data) {
        const feedback = new FeedbackProduct(data);
        await feedback.save();
        
        // Cập nhật rating của product
        await this.updateProductRating(data.product_id);
        
        return feedback;
    }

    async getProductFeedbacks(productId) {
        return await FeedbackProduct.find({ product_id: productId });
    }

    async updateProductFeedback(id, data) {
        const feedback = await FeedbackProduct.findByIdAndUpdate(id, data, { new: true });
        if (feedback) {
            await this.updateProductRating(feedback.product_id);
        }
        return feedback;
    }

    async deleteProductFeedback(id) {
        const feedback = await FeedbackProduct.findById(id);
        if (feedback) {
            await FeedbackProduct.findByIdAndDelete(id);
            await this.updateProductRating(feedback.product_id);
        }
        return feedback;
    }

    // Helper methods
    async updateBusinessRating(businessId) {
        const feedbacks = await FeedbackBusiness.find({ business_id: businessId });
        if (feedbacks.length === 0) return null;

        const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
        const averageRating = totalRating / feedbacks.length;

        return await Business.findByIdAndUpdate(
            businessId,
            { business_rating: averageRating },
            { new: true }
        );
    }

    async updateProductRating(productId) {
        const feedbacks = await FeedbackProduct.find({ product_id: productId });
        if (feedbacks.length === 0) return null;

        const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
        const averageRating = totalRating / feedbacks.length;

        return await Product.findByIdAndUpdate(
            productId,
            { product_rating: averageRating },
            { new: true }
        );
    }
}

module.exports = new FeedbackService(); 