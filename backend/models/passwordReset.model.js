const mongoose = require("mongoose")

const passwordResetSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    changedAt: {
        type: Date,
        default: Date.now
    }
})

const passwordResetModel = mongoose.model("passwordReset", passwordResetSchema)

module.exports = passwordResetModel