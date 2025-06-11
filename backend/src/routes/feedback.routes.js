const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedback.controller');

router.post('/', FeedbackController.createFeedback);
router.get('/', FeedbackController.getAllFeedbacks);
router.get('/:id', FeedbackController.getFeedbackById);
router.get('/business/:businessId', FeedbackController.getFeedbackByBusinessId);
router.get('/product/:productId', FeedbackController.getFeedbackByProductId);
router.put('/:id', FeedbackController.updateFeedback);
router.delete('/:id', FeedbackController.deleteFeedback);
router.patch('/:id/like', FeedbackController.incrementLike);
router.patch('/:id/dislike', FeedbackController.incrementDislike);
router.patch('/:id/response', FeedbackController.updateFeedbackResponse);

module.exports = router;