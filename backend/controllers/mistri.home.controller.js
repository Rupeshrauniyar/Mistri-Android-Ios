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

        const order = await orderModel.find({ profession, status: "pending" }).populate({
            path: "user",
            select: "-email -password -contactNumber -orders -acceptedOrder -history -favourites "

        })


        if (order && order.length > 0) {
            const filteredOrder = order.filter(
                (order) => !rejectedOrders.includes(order._id.toString()) // Compare as strings
            );
            if (filteredOrder.length > 0) {
                res.json({ status: "OK", order: filteredOrder, message: "Fetched universal order successfully" });

            } else {
                res.json({ status: "OK", message: "No universal order found" });

            }
        }
        else {
            res.json({ status: "OK", message: "No universal order found" });
        }
    } catch (err) {
        res.json({ status: "BAD", message: "Something went wrong" })
    }

}

const fetchAcceptedOrder = async (req, res) => {
    try {
        const Data = req.body
        // console.log(Data)
        const mistri = await mistriModel.findOne({ _id: Data.id }).populate({

            path: "acceptedOrder orders",
            select: "-otp -mistri",
            populate: {
                path: "user",
                select: "-email -password -contactNumber -orders -acceptedOrder -history -favourites "

            }
        })

        if (mistri && mistri._id) {

            res.json({ status: "OK", activeOrders: mistri.acceptedOrder, message: "Fetched accepted order successfully" });
        }
        else {
            res.json({ status: "OK", message: "No accepted order found", });
        }
    } catch (err) {
        res.json({ status: "BAD", message: "Something went wrong" })
        console.error(err.message)
    }

}

const fetchOrders = async (req, res) => {
    const Data = req.body
    try {
        if (Data) {
            const orders = await orderModel.find({ mistri: Data.id }).select("-otp -mistri").populate({
                path: "user",
                select: "-email -password -contactNumber -orders -acceptedOrder -history -favourites "

            })
            if (orders) {
                res.status(200).json({ orders, status: "OK" })
            } else {
                res.status(404).json({ status: "BAD" })

            }
        }
    } catch (err) {
        res.status(404).json({ status: "BAD" })
    }
}

const fetchParticularAcceptedOrder = async (req, res) => {
    const Data = req.body
    if (Data) {
        console.log(Data.id)
        const id = Data.id.toString()
        try {
            const order = await orderModel.findOne({ _id: id }).select("-otp").populate({
                path: "user",
                select: "-password -email -contactNumber -orders -acceptedOrder -history "
            })
            // console.log(order)
            if (order && order._id) {
                res.status(200).json({ status: "OK", order })
            } else {
                res.status(401).json({ status: 'BAD', msg: "Not found" })
            }
        } catch (err) {
            res.status(401).json({ status: 'BAD', err })
        }
    } else {
        res.status(401).json({ status: 'BAD', msg: "Data not available" })
    }
}

const fetchHistory = async (req, res) => {
    const Data = req.body
    try {
        if (Data) {
            const order = await mistriModel.findOne({ _id: Data.id }).populate({
                path: "history",
                select: "-otp -mistri",
                populate: {
                    path: "user",
                    select: "-email -password -contactNumber -orders -acceptedOrder -history -favourites "
                },

            }).select("-password")
            if (order) {
                const history = order.history
                console.log(history)
                res.status(200).json({ history, status: "OK" })
            } else {
                res.status(404).json({ status: "BAD" })

            }
        }
    } catch (err) {
        res.status(404).json({ status: "BAD" })
    }
}


module.exports = { checkController, fetchUniversalOrder, fetchOrders, fetchAcceptedOrder, fetchParticularAcceptedOrder, fetchHistory } 