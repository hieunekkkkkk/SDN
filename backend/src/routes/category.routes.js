const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Lấy tất cả categories
router.get('/', categoryController.getAllCategories);

// Lấy category theo ID
router.get('/:id', categoryController.getCategoryById);

// Lấy category theo category_id
router.get('/category-id/:categoryId', categoryController.getCategoryByCategoryId);

// Tạo category mới
router.post('/', categoryController.createCategory);

// Cập nhật category
router.put('/:id', categoryController.updateCategory);

// Xóa category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 