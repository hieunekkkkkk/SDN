const categoryService = require('../services/category.service');
const CategoryDTO = require('../entity/dto/category.dto');

class CategoryController {
    // Lấy tất cả categories
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json({
                status: 'success',
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Lấy category theo ID
    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }
            res.json({
                status: 'success',
                data: category
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Lấy category theo category_id
    async getCategoryByCategoryId(req, res) {
        try {
            const category = await categoryService.getCategoryByCategoryId(req.params.categoryId);
            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }
            res.json({
                status: 'success',
                data: category
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Tạo category mới
    async createCategory(req, res) {
        try {
            const categoryDTO = new CategoryDTO(req.body);
            const newCategory = await categoryService.createCategory(categoryDTO);
            res.status(201).json({
                status: 'success',
                data: newCategory
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Cập nhật category
    async updateCategory(req, res) {
        try {
            const categoryDTO = new CategoryDTO(req.body);
            const updatedCategory = await categoryService.updateCategory(req.params.id, categoryDTO);
            if (!updatedCategory) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }
            res.json({
                status: 'success',
                data: updatedCategory
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Xóa category
    async deleteCategory(req, res) {
        try {
            const deletedCategory = await categoryService.deleteCategory(req.params.id);
            if (!deletedCategory) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Category not found'
                });
            }
            res.json({
                status: 'success',
                message: 'Category deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController(); 