const express = require('express')
const app = express()
const userModel = require('../models/user.model.js')
const mistriModel = require('../models/mistri.model.js')
const jwt = require("jsonwebtoken")
require("dotenv").config()

const checkController = async (req, res) => {
    const { token } = req.body; // Destructure the token from req.body
    try {

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT); // Verify the token

            if (decoded && decoded.userId) {
                const user = await userModel.findById(decoded.userId)
                    .select("-password")
                    .populate({
                        path: "acceptedOrder",
                        populate: [
                            { path: "user", select: "-contactNumber -password -email -role" },   // Populating user inside each order
                            { path: "mistri", select: "-contactNumber -password -email -role" }  // Populating mistri inside each order
                        ]
                    })
                    .populate({
                        path: "orders",
                        populate: [
                            { path: "user", select: "-contactNumber -password -email -role" },   // Populating user inside each order
                            { path: "mistri", select: "-contactNumber -password -email -role" }  // Populating mistri inside each order
                        ]
                    }).populate({
                        path: "history",
                        populate: [
                            { path: "user", select: "-contactNumber -password -email -role" },   // Populating user inside each order
                            { path: "mistri", select: "-contactNumber -password -email -role" }  // Populating mistri inside each order
                        ]
                    });


                if (user) {
                    user.acceptedOrder.forEach((acceptedOrd) => {
                        const decoded = jwt.verify(acceptedOrd.otp, process.env.JWT)
                        acceptedOrd.otp = decoded
                        // var filteredOrders = user.orders.filter(order => {
                        //     return acceptedOrd._id.toString() !== order._id.toString()
                        // })
                        // user.orders = filteredOrders
                    })
                    return res.json({ status: "OK", user, message: "User verified successfully" });
                } else {
                    return res.json({ status: "BAD", message: "User not available" });
                }
            } else {
                return res.json({ status: "BAD", message: "Invalid token" });
            }
        } else {
            return res.json({ status: "BAD", message: "Token not provided" });
        }
    } catch (err) {
        return res.json({ status: "BAD", message: "Something went wrong" });
    }
};

const userFetchMistriController = async (req, res) => {
    try {

        const mistri = await mistriModel.find({ isVerified: true, isAvailable: true }).select("-password -contactNumber -email -idProof -isVerified -createdAt -role -__v").limit(5)
        if (mistri && mistri.length > 0) {
            return res.json({ message: "Mistri found", status: "OK", mistri })

        } else {
            return res.json({ message: "Mistri not found", status: "OK", mistri });

        }

    } catch (error) {
        res.json({ message: "Server error" });
    }
};




module.exports = { userFetchMistriController, checkController }