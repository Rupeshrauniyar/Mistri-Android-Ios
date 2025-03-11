const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');
const mistriModel = require('../models/mistri.model.js');
const orderModel = require('../models/order.model.js');

require("dotenv").config();


const displayBookingMistri = async (req, res) => {
    const data = req.body;
    try {
        const mistri = await mistriModel
            .findOne({ _id: data.mistriId })
            .select("-password -contactNumber -email -idProof -isVerified -createdAt -role -__v -orders -rejectedOrders -acceptedOrder -history ");
        if (mistri) {
            return res.json({ message: "Mistri found", status: "OK", mistri });

        } else {
            return res.json({ message: "Mistri not found", status: "OK" });
            // return
        }
    } catch (error) {
     
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = displayBookingMistri