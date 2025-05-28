const express = require('express');
const router = express.Router();
const feedbackBusinessController = require('../controllers/feedback_business.controller');

router.get('/', feedbackBusinessController.getAll);
router.get('/:id', feedbackBusinessController.getById);
router.post('/', feedbackBusinessController.create);
router.put('/:id', feedbackBusinessController.update);
router.delete('/:id', feedbackBusinessController.delete);

module.exports = router; 