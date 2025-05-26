const express = require('express');
const router = express.Router();
const ownerStackController = require('../controllers/owner_stack.controller');

router.get('/', ownerStackController.getAll);
router.get('/:id', ownerStackController.getById);
router.post('/', ownerStackController.create);
router.put('/:id', ownerStackController.update);
router.delete('/:id', ownerStackController.delete);

module.exports = router; 