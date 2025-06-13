const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUser);
router.put('/:userId', UserController.updateUser);
router.put('/:userId/lock', UserController.lockUser);
router.put('/:userId/unlock', UserController.unlockUser);
module.exports = router;