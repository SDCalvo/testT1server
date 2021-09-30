const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        unique: true
    },
    img:{
        type: String,
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },

} , { timestamps: true, autoCreate: true });

const Product = mongoose.model('Product', productsSchema); 
module.exports = Product;