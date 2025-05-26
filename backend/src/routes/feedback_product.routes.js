const express = require('express');
const router = express.Router();
const feedbackProductController = require('../controllers/feedback_product.controller');

router.get('/', feedbackProductController.getAll);
router.get('/:id', feedbackProductController.getById);
router.post('/', feedbackProductController.create);
router.put('/:id', feedbackProductController.update);
router.delete('/:id', feedbackProductController.delete);

module.exports = router; 