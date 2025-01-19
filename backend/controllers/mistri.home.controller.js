const express = require('express')
const app = express()
// const mistriModel = require('../models/mistri.model.js')
const mistriModel = require('../models/mistri.model.js')
const jwt = require("jsonwebtoken")
const orderModel = require('../models/order.model.js')

const checkController = async (req, res) => {
    const { token } = req.body; // Destructure the token from req.body
    try {

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT); // Verify the token

            if (decoded && decoded.mistriId) {
                const mistri = await mistriModel.findOne({ _id: decoded.mistriId }).select("-password")
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
                    }).select("-otp")
                if (mistri) {

                    return res.json({ status: "OK", mistri, message: "mistri verified successfully" });

                } else {
                    return res.json({ status: "BAD", message: "mistri not available" });
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


const fetchUniversalOrder = async (req, res) => {
    try {
        const Data = req.body
        const profession = req.body[0]?.profession;
        const rejectedOrders = req.body[1]?.rejectedOrders || []; // Ensure rejectedOrders is always an array

        const order = await orderModel.find({ profession, status: "pending" }).populate("user").select("-password -contactNumber -role -email")
        if (order && order.length > 0) {
            const filteredOrder = order.filter(
                (order) => !rejectedOrders.includes(order._id.toString()) // Compare as strings
            );
            res.json({ status: "OK", order: filteredOrder, message: "Fetched universal order successfully" });
        }
        else {
            res.json({ status: "OK", message: "No universal order found" });
        }
    } catch (err) {
        res.json({ status: "BAD", message: "Something went wrong" })
    }

}
const fetchOrder = async (req, res) => {
    try {
        const Data = req.body
        const order = await orderModel.find({ mistri: Data.id }).populate("mistri user")
        if (order) {
            // const order = mistri.orders
            res.json({ status: "OK", order, message: "Fetched order successfully" });
        }
        else {
            res.json({ status: "OK", message: "No order found", });
        }
    } catch (err) {
        res.json({ status: "BAD", message: "Something went wrong" })
    }

}
const fetchAcceptedOrder = async (req, res) => {
    try {
        const Data = req.body
        const mistri = await mistriModel.findOne({ _id: Data.id }).populate("acceptedOrder")

        if (mistri && mistri.length > 0) {

            res.json({ status: "OK", mistri, message: "Fetched accepted order successfully" });
        }
        else {
            res.json({ status: "OK", message: "No accepted order found", });
        }
    } catch (err) {
        res.json({ status: "BAD", message: "Something went wrong" })
    }

}


module.exports = { checkController, fetchUniversalOrder, fetchOrder, fetchAcceptedOrder } 