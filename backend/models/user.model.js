const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type:String,
        default: 'male'
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
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
    }],
    acceptedOrder: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "mistris",

    }],
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
    }]
}
)

const userModel = mongoose.model('users', userSchema)
module.exports = userModel
