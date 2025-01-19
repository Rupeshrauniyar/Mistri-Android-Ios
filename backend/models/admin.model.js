const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({
    adminname: {
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
        default: 'admin'
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
    profileImage: {
        type: String,
        default: "default_profile_image.png"
    },


}
)

const adminModel = mongoose.model('admin', adminSchema)
module.exports = adminModel
