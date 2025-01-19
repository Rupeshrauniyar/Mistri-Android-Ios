const mongoose = require('mongoose');


const mistriSchema = mongoose.Schema({
    mistriname: {
        type: String,
        required: true
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
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'mistri'
    },
    address: {
        type: String,
        required: true
    },
    idProof: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",

    }],
    ratings: {
        type: String,
        default: "0"
    },
    profileImage: {
        type: String,
        required: false,
        default: "default_profile_image.png"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rejectedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    profession: {
        type: String,
        required: true
    },
    charges: {
        type: Number,
        required: true
    },
    acceptedOrder: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",

    }],
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",

    }]
}
)

const mistriModel = mongoose.model('mistris', mistriSchema)
module.exports = mistriModel
