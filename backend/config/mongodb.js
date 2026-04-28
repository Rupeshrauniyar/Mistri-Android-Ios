const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Force public DNS resolvers so MongoDB SRV lookups work locally.
dns.setServers(['1.1.1.1', '8.8.8.8']);

const DB = mongoose.connect(process.env.MONGODB_URI).then(function () {
    try {
        console.log("Connected to DB.")
    } catch (err) {
        console.log(err)
    }
});


module.exports = DB;