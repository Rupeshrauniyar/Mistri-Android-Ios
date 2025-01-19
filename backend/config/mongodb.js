const mongoose = require('mongoose')
require('dotenv').config()




const DB = mongoose.connect(process.env.MONGODB_URI).then(function () {
    try {
        console.log("Connected to backend.")
    } catch (err) {
    }
})


module.exports = DB