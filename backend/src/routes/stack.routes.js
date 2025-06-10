const express = require('express');
const router = express.Router();
const StackController = require('../controllers/stack.controller');


router.get('/', StackController.getAllStacks);
router.get('/:id', StackController.getStackById);


module.exports = router;