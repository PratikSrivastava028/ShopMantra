const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ['USD', 'INR'],
            default: 'INR'
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sellerName: {
        type: String,
        default: ''
    },
    images: [
        {
            url: String,
            thumbnail: String,
            id: String
        }
    ],
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: 'Electronics'
    },
    salesCount: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    specs: [
        {
            name: String,
            value: String
        }
    ],
    active: {
        type: Boolean,
        default: true   // true = visible to customers; false = paused
    }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('product', productSchema);