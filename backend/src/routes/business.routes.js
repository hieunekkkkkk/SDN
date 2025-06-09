const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/business.controller');

router.post('/', BusinessController.createBusiness);
router.get('/filter', BusinessController.filterBusinesses);
router.get('/', BusinessController.getAllBusinesses);
router.get('/search', BusinessController.searchBusinesses);
router.get('/near', BusinessController.findNearestBusinesses);
router.get('/:id', BusinessController.getBusinessById);
router.put('/:id', BusinessController.updateBusiness);
router.delete('/:id', BusinessController.deleteBusiness);
router.get('/category/:categoryId', BusinessController.getBusinessByCategory);

module.exports = router;