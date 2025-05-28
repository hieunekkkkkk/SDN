const express = require('express');
const router = express.Router();
const stackController = require('../controllers/stack.controller');

router.get('/', stackController.getAll);
router.get('/:id', stackController.getById);
router.post('/', stackController.create);
router.put('/:id', stackController.update);
router.delete('/:id', stackController.delete);

module.exports = router; 