const express = require('express');
const router = express.Router();
const product = require('../models/productsModel.js');
const productCtrl = require('../controllers/productsController.js');
const auth = require('../middlewares/middlewares');

//Getting all the data from the database
router.get('/', productCtrl.getAllProducts);

// //Getting recipes from a search
// router.get('/search', recipeCtrl.getRecipesBySearch);

//Getting one element from the database
router.get('/:id', getProduct, productCtrl.getOneProduct);

//Creating a new element in the database
router.post('/', auth.authenticateToken, auth.isAdmin, productCtrl.createProduct);

//Updating an existing element in the database
router.patch('/:id', auth.authenticateToken, auth.isAdmin, getProduct, productCtrl.updateProduct);

//Deleting an existing element in the database
router.delete('/:id', auth.authenticateToken, auth.isAdmin, getProduct, productCtrl.deleteProduct);

//Middleware for getting the id of a product
async function getProduct(req, res, next) {
    let prd
    try{
        prd = await product.findById(req.params.id);
        if(prd == null){
            return res.status(404).json({message: 'No such element'});
        }
    }catch(err){
        res.status(500).json({message: err.message });
        console.log("error: ", err);
    }

    res.product = prd;
    next();
}

module.exports = router;