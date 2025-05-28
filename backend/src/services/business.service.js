const Business = require('../entity/module/business.model');
const Product = require('../entity/module/product.model');
const Category = require('../entity/module/category.model');
const FeedbackBusiness = require('../entity/module/feedback_business.model');

class BusinessService {
    async getBusinessById(id) {
        return await Business.findById(id);
    }

    async getAllBusinesses() {
        return await Business.find();
    }

    async createBusiness(data) {
        const business = new Business(data);
        return await business.save();
    }

    async updateBusiness(id, data) {
        return await Business.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteBusiness(id) {
        // Xóa các sản phẩm liên quan
        await Product.deleteMany({ business_id: id });
        // Xóa các category liên quan
        await Category.deleteMany({ business_id: id });
        // Xóa các feedback liên quan
        await FeedbackBusiness.deleteMany({ business_id: id });
        // Xóa business
        return await Business.findByIdAndDelete(id);
    }

    async getBusinessWithDetails(id) {
        const business = await Business.findById(id);
        if (!business) return null;

        const [products, categories, feedbacks] = await Promise.all([
            Product.find({ business_id: id }),
            Category.find({ business_id: id }),
            FeedbackBusiness.find({ business_id: id })
        ]);

        return {
            ...business.toObject(),
            products,
            categories,
            feedbacks
        };
    }

    async updateBusinessRating(id) {
        const feedbacks = await FeedbackBusiness.find({ business_id: id });
        if (feedbacks.length === 0) return null;

        const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
        const averageRating = totalRating / feedbacks.length;

        return await Business.findByIdAndUpdate(
            id,
            { business_rating: averageRating },
            { new: true }
        );
    }
}

module.exports = new BusinessService(); 