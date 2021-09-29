const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        default: null
    },
    lastName: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },

} , { timestamps: true, autoCreate: true });


module.exports = mongoose.model('User', userSchema);