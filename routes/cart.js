const express = require('express');
const router = express.Router();
const cart = require('../models/cartModel.js');
const cartCtrl = require('../controllers/cartController.js');
const auth = require('../middlewares/middlewares');

router.get('/', auth.authenticateToken, cartCtrl.getCart);
router.post('/', auth.authenticateToken, cartCtrl.addToCart);
router.delete('/:cartDetailId', auth.authenticateToken, cartCtrl.deleteFromCart);
router.put('/:cartDetailId', auth.authenticateToken, cartCtrl.updateCart);

module.exports = router;