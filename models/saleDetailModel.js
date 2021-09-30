import mongoose from 'mongoose';

const saleDetailSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sale',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    },
    { timestamps: true },
);

const SaleDetail = mongoose.model('SaleDetail', saleDetailSchema);
export default SaleDetail;