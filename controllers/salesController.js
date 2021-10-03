const mongoose = require('mongoose');
const sale = require('../models/saleModel');
const saleDetail = require('../models/saleDetailModel');
const product = require('../models/productsModel');
const cart = require('../models/cartModel');
const cartDetail = require('../models/cartDetailModel');

async function addSale(req, res, next) {
    
    let response = null;
    try {
        
        const { paymentMethod, address, observation
        } = req.body;
        const user = req.user;

        if (!(paymentMethod && address)) {
            throw new Error('Todos los campos son obligatorios.');
        }

        const foundCart = await cart.findOne({ user: mongoose.Types.ObjectId(user.id) });
        if (!foundCart) {
            throw new Error('El carrito no existe.');
        }

        const foundCartDetail = await cartDetail.find({
            cart: mongoose.Types.ObjectId(foundCart._id)
        }).populate('product',{price:1});
        if (!foundCartDetail) {
            throw new Error('El detalle del carrito no existe.');
        }

        let total = 0.0;
        console.log("foundCartDetail: ", foundCartDetail);
        foundCartDetail.forEach((detail) => {
            console.log("detail", detail);
            total += detail.quantity * parseFloat(detail.product.price);
        });

        const newSale = new sale({
            paymentMethod: paymentMethod,
            total: total,
            address: address,
            observation: observation,
            user: mongoose.Types.ObjectId(user.id),
        });
        await newSale.save();
        console.log("newSale: ", newSale);
        foundCartDetail.forEach( async (detail) => {
            const thisSaleDetail = new saleDetail({
                quantity: detail.quantity,
                price: detail.product.price,
                sale: mongoose.Types.ObjectId(newSale._id),
                product: mongoose.Types.ObjectId(detail.product._id),
            });
            await thisSaleDetail.save();
            console.log("thisSaleDetail: ", thisSaleDetail);
        });

        foundCartDetail.forEach(async (detail) => {
            const thisProduct = await product.findOne({ _id: detail.product._id });
            thisProduct.stock = thisProduct.stock - detail.quantity;
            await thisProduct.save();
        });

        await cartDetail.deleteMany({ cart: foundCart._id });
        await cart.deleteOne({ _id: foundCart._id }); 

        response = {
            message: 'La venta se ha realizado con éxito.',
            data: newSale
        };
        res.status(200).json(response);

    } catch (e) {
        console.log(e);
        response = {
            message: e.message,
            data: null
        };
        res.status(400).json(response);
    }
}

async function getAllSales(req, res, next) {

    let response = null;
    try {
        const user = req.user;
        const foundSells = await sale.find({ user: mongoose.Types.ObjectId(user.id) }).select({'user':0}).lean();
        console.log("foundSells: ", foundSells);
        const responseSells = [...foundSells];

        for (let i = 0; i < foundSells.length; i++) {
            const sale = foundSells[i];
            const detail = await saleDetail.find({ sale: mongoose.Types.ObjectId(sale._id) }).populate('product',{price:1});
            console.log("detail", detail);
            responseSells[i]['detail'] = [...detail];
        }

        if (!foundSells) {
            throw new Error('No se encontraron ventas.');
        }
        // console.log("foundSells: ", foundSells);
        console.log("responseSells: ", responseSells);
        response = {
            message: 'Ventas encontradas.',
            data: responseSells
        };
        res.status(200).json(response);
    } catch (e) {
        console.log(e);
        response = {
            message: e.message,
            data: null
        };
        res.status(400).json(response);
    }
}


exports.addSale = addSale;
exports.getAllSales = getAllSales;