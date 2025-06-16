const BusinessModel = require('../entity/module/business.model');
const ProductModel = require('../entity/module/product.model');

class AiService {
    // Helper method to get all businesses
    async getAllBusinesses() {
        try {
            return await BusinessModel.find().lean(); // Use .lean() for plain JS objects
        } catch (error) {
            throw new Error(`Error fetching businesses: ${error.message}`);
        }
    }

    // Helper method to get all products
    async getAllProducts() {
        try {
            return await ProductModel.find().lean();
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    // Main method to get businesses with their products
    async getAllBusinessWithProducts() {
        try {
            const businesses = await this.getAllBusinesses();
            const products = await this.getAllProducts();

            return businesses.map(business => ({
                "business_id": business._id,
                "business_name": business.business_name,
                "business_address": business.business_address,
                "business_detail": business.business_detail,
                "business_status": business.business_status,
                "business_image": business.business_image,
                products: products.filter(product =>
                    product.business_id.toString() === business._id.toString()
                ).map(product => ({
                    "product_id": product._id,
                    "product_name": product.product_name,
                    "product_description": product.product_description,
                    "product_price": product.product_price
                }))
            }));
        } catch (error) {
            throw new Error(`Error fetching businesses with products: ${error.message}`);
        }
    }

    async getRecommendations(text) {
        try {
            //Fill service AI in here



            console.log(text);
            return "OK";
        } catch (error) {
            throw new Error(`Error getting recommendations: ${error.message}`);
        }
    }
}

module.exports = new AiService();