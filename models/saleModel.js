const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
    {
        paymentMethod: {
            type: String,
            required: true
        },
        total: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        observation: {
            type: String,
            required: true
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;