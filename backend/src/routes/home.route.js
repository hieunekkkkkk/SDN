const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/home.controller');

/**
 * @swagger
 * /api/home:
 *   get:
 *     tags:
 *       - Home
 *     summary: Get home page
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', HomeController.homeController);

module.exports = router;