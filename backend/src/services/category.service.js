const Category = require('../entity/module/category.model');

class CategoryService {
    async getAllCategories() {
        return await Category.find();
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async getCategoryByCategoryId(categoryId) {
        return await Category.findOne({ category_id: categoryId });
    }

    async createCategory(categoryData) {
        const category = new Category(categoryData);
        return await category.save();
    }

    async updateCategory(id, categoryData) {
        return await Category.findByIdAndUpdate(id, categoryData, { new: true });
    }

    async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = new CategoryService(); 