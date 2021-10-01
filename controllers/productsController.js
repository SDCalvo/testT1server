const products = require('../models/productsModel.js');
    
async function getAllProducts(req, res) {
    
    try{
        const productsRes = await products.find();
        res.json(productsRes);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    return res;
}

async function getOneProduct(req, res) {
        res.json(res.product); 
}

// async function getRecipesBySearch(req, res) {
//     /*
//         This function accepts an optional field value
//         if the field value is provided, it will search for all the values 
//         provided in the field provided
//         if the field value is not provided, it will search for all
//         the values provided in every field
//     */
//     try{
//         const field = req.query.field;
//         let search = req.query.search;
//         if(field===undefined){
//             //search for all the values in every field
//             if(Array.isArray(search)){
//                 search = search.join(' ');
//             }
//             const recipes = await recipe.find({$text: {$search: search}});
//             res.json(recipes);
//         }else{
//             //search for all the values in the field provided
//             if(!Array.isArray(search)){
//                 search = [search];
//             }
//             for(let i=0; i<search.length; i++){
//                 search[i] = new RegExp(search[i], 'i');
//             }
//             const recipes = await recipe.find({[field]: {$in: search}});
//             res.json(recipes);
//         }  
//     }catch(err){
//         res.status(500).json({message: err.message});
//     }
// }

async function createProduct(req, res) {
        

        if(!req.body.name || !req.body.description || !req.body.price || !req.body.img ){
            return res.status(400).json({message: 'Por favor llenar todos los campos obligatorios, los campos obligatorios son: name, description, img y price'});
        }

        const prd = new products({
            
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            img: req.body.img,
            stock: req.body.stock
        });
        try{
            const newProduct = await prd.save();
            res.status(201).json(newProduct);
        } catch(err){
            res.status(400).json({message: err.message});
        }    
}

async function updateProduct(req, res) {
        
    let prd = res.product;
        prd.name = req.body.name;
        prd.description = req.body.description;
        prd.price = req.body.price;
        prd.img = req.body.img;
        prd.stock = req.body.stock;
        
        try{
            const newProduct = await prd.save();
            res.status(201).json(newProduct);
        } catch(err){
            res.status(400).json({message: err.message});
    }
}

async function deleteProduct(req, res) {
    
    let prd = res.product;
    try{
        await prd.remove();
        res.status(201).json({message: 'Producto eliminado'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.getAllProducts = getAllProducts;
exports.getOneProduct = getOneProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;