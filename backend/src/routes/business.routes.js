const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');

router.get('/', businessController.getAll);
router.get('/category/:category_id', businessController.getByCategory);
router.get('/:id', businessController.getById);
router.post('/', businessController.create);
router.put('/:id', businessController.update);
router.delete('/:id', businessController.delete);

module.exports = router; 