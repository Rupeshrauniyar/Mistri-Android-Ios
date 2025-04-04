const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    mistri: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mistris',
    },
    products: [
        {
            productName: {
                type: String,
            },
            productPrice: {
                type: Number,
            },
            quantity: {
                type: Number,
            },
        }
    ],
    charges: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'working', 'completed', 'cancelled'],
        default: 'pending'
    },
    orderTime: {
        type: String,
        required: true
    },
    orderDate: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    },
    profession: {
        type: String,

    },
    otp: {
        type: String,
    }

})

const orderModel = mongoose.model('orders', orderSchema)
module.exports = orderModel
