const mongoose = require('mongoose');


const mistriVerificationSchema = mongoose.Schema({
    mistri: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mistris"
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employers"
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
}
)

const mistriVerificationModel = mongoose.model('mistri-verification', mistriVerificationSchema)
module.exports = mistriVerificationModel
