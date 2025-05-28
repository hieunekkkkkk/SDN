const Product = require('../entity/module/product.model');
const FeedbackProduct = require('../entity/module/feedback_product.model');

class ProductService {
    async getProductById(id) {
        return await Product.findById(id);
    }

    async getProductsByBusinessId(businessId) {
        return await Product.find({ business_id: businessId });
    }

    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }

    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProduct(id) {
        // Xóa các feedback liên quan
        await FeedbackProduct.deleteMany({ product_id: id });
        // Xóa product
        return await Product.findByIdAndDelete(id);
    }

    async getProductWithDetails(id) {
        const product = await Product.findById(id);
        if (!product) return null;

        const feedbacks = await FeedbackProduct.find({ product_id: id });

        return {
            ...product.toObject(),
            feedbacks
        };
    }

    async updateProductRating(id) {
        const feedbacks = await FeedbackProduct.find({ product_id: id });
        if (feedbacks.length === 0) return null;

        const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
        const averageRating = totalRating / feedbacks.length;

        return await Product.findByIdAndUpdate(
            id,
            { product_rating: averageRating },
            { new: true }
        );
    }
}

module.exports = new ProductService(); 