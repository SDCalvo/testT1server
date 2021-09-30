const mongoose = require('mongoose');
const Cart = require('../models/cartModel.js');
const Product = require('../models/productsModel.js');
const CartDetail = require('../models/cartDetailModel.js');

async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;

        if (!(productId && quantity)) {
            throw new Error('Todos los campos son necesarios');
        }

        const product = await Product.findOne({_id: productId});
        if (product) {
            if (product.stock < quantity) {
                throw new Error('No hay suficiente stock');
            }
        } else {
            throw new Error('El producto no existe');
        }

        let cart = await Cart.findOne({ user: mongoose.Types.ObjectId(user.id) });
        if (!cart) {
            cart = new Cart({
                user: mongoose.Types.ObjectId(user.id)
            });
            await cart.save();
        }
        
        // Validate if product already exist in the cart
        let cartDetail = await CartDetail.findOne({
            cart: mongoose.Types.ObjectId(cart._id),
            product: mongoose.Types.ObjectId(productId)
        });
        if (cartDetail) {
            throw new Error('El producto ya existe en el carrito');
        }

        // Create and save cart detail
        cartDetail = new CartDetail({
            quantity: quantity,
            cart: mongoose.Types.ObjectId(cart._id),
            product: mongoose.Types.ObjectId(productId),
        });
        await cartDetail.save();
        
        const response = {
            message: 'Producto agregado al carrito',
            cart: cart,
            cartDetail: cartDetail
        };
        res.status(200).json(response);

    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: e.message
        });
    }
}

async function getCart(req, res) {

    try {
        const user = req.user;
        
        let cart = await Cart.findOne({ user: mongoose.Types.ObjectId(user.id) });
        
        if (!cart) {
            throw new Error('El carrito no existe');
        }

        let cartDetail = await CartDetail.find({
            cart: mongoose.Types.ObjectId(cart._id)
        }).select({ 'cart': 0, 'createdAt': 0, 'updatedAt': 0 })
            .populate('product', { 'name': 1, 'price': 1, 'stock': 1 });

        if (cartDetail) {
            const response = {
                cart: cart,
                cartDetail: cartDetail
            };
            return res.status(200).send(response);
        } else {
            throw new Error('El carrito no existe');
        }

    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: e.message
        });
    }
}

async function deleteFromCart(req, res) {
    try {
        const cartDetailId = req.params.cartDetailId;
        console.log("cartdetID: ", cartDetailId);
        const cartDetail = await CartDetail.findById(cartDetailId);
        if (!cartDetail) {
            throw new Error('El detalle del carrito no existe');
        }

        await cartDetail.remove();

        const response = {
            message: 'Producto eliminado del carrito'
        };
        res.status(200).json(response);

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}

async function updateCart(req, res) {
    try {
        const cartDetailId = req.params.cartDetailId;
        console.log("cartdetID: ", cartDetailId);
        const quantity = req.body.quantity;
        console.log("quantity: ", quantity);
        const cartDetail = await CartDetail.findById(cartDetailId);
        if (!cartDetail) {
            throw new Error('El detalle del carrito no existe');
        }

        const product = await Product.findById(cartDetail.product);
        if (product.stock < quantity) {
            throw new Error('No hay suficiente stock');
        }

        cartDetail.quantity = quantity;
        await cartDetail.save();

        const response = {
            message: 'Producto actualizado',
            cartDetail: cartDetail
        };
        res.status(200).json(response);

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
}

exports.addToCart = addToCart;
exports.getCart = getCart;
exports.deleteFromCart = deleteFromCart;
exports.updateCart = updateCart;