const mongoose = require('mongoose');


const employerSchema = mongoose.Schema({
    employername: {
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
        default: 'employer'
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
    ratings: {
        type: String,
        default: "0"
    },
    profileImage: {
        type: String,
        default: "default_profile_image.png"
    },
}
)

const employerModel = mongoose.model('employers', employerSchema)
module.exports = employerModel
