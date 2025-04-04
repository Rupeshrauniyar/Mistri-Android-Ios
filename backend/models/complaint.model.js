const mongoose = require('mongoose');


const complaintSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "users"
    },
    mistri: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "mistris"
    },
    order: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "orders"
    },
    complaint: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'ignored'],
        default: 'pending'
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employers"
    },
    processedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    }




})

const complaintModel = mongoose.model('complaints', complaintSchema)
module.exports = complaintModel
