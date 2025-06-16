const AiController = require('../controllers/ai.controller');
const express = require('express');
const router = express.Router();

router.get('/recommend', AiController.getAllBusinessWithProducts.bind(AiController));

module.exports = router;