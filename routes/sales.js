const express = require('express');
const router = express.Router();
const auth = require('../middlewares/middlewares');
const salesCtrl = require('../controllers/salesController');

// Get all sales
router.get('/', auth.authenticateToken, salesCtrl.getAllSales);

// Make a sell
router.post('/', auth.authenticateToken, salesCtrl.addSale);

module.exports = router;