const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');
const mistriModel = require('../models/mistri.model.js');
const orderModel = require('../models/order.model.js');

require("dotenv").config();

const getActiveBookings = async (req, res) => {
    const data = req.body
    // console.log(data)
    const order = await orderModel
        .findOne({ _id: data.orderId })
        .populate({
            path: "user",
            select: "-orders -acceptedOrder -history -password -contactName -role -email", // Unselect fields from the 'user'
        }) 
        .populate({
            path: "mistri",
            select: "-orders -acceptedOrder -rejectedOrders -idProof -profileImage -history -password -contactName -role -email", // Unselect fields from the 'mistri'
        })
    const unHashedOtp = jwt.verify(order.otp, process.env.JWT)
    console.log(unHashedOtp)
    order.otp = unHashedOtp
    if (order) {
        return res.json({ status: "OK", order })
    } else {
        return res.json({ status: "OK" })

    }
}

const confirmBooking = async (req, res) => {
    try {
        const data = req.body;
        const user = data.user;
        console.log(data)
        // console.log(user)
        if (data) {
            const searchMistri = await mistriModel.findOne({ _id: data.mistriId }).populate("acceptedOrder")
            if (searchMistri.acceptedOrder.length > 0) {
                // Loop through each acceptedOrder in case there are multiple
                for (let order of searchMistri.acceptedOrder) {
                    // Check if the order date matches the new booking date
                    if (order.orderDate === data.date) {
                        const acceptedOrderTime = parseInt(order.orderTime.split(":")[0]); // Get hours from orderTime (assuming "HH:MM" format)
                        const userTime = parseInt(data.time.split(":")[0]); // Get hours from user time (assuming "HH:MM" format)

                        // Check if it's the exact same time
                        if (acceptedOrderTime === userTime) {
                            return res.json({ message: "Mistri is already booked at the same time", status: "BAD" });
                        }

                        // Check if the time difference is less than 5 hours
                        const timeDifference = Math.abs(acceptedOrderTime - userTime);
                        if (timeDifference < 5) {
                            return res.json({ message: "Mistri is already booked within 5 hours", status: "BAD" });
                        }
                    }
                }
            }

            const order = await orderModel.create({
                user: data.userId,
                mistri: data.mistriId,
                charges: data.charges,
                totalAmount: data.charges,
                orderTime: data.time,
                orderDate: data.date,
            })
            if (order) {
                const populatedOrder = await orderModel.findOne({ _id: order._id }).populate("user mistri").select("-password -contactName -role -email")
                const user = await userModel.findOneAndUpdate({ _id: data.userId }, { $push: { orders: order._id, history: order._id } }, { new: true }).select("-password -contactName -role -email")
                const mistri = await mistriModel.findOneAndUpdate({ _id: data.mistriId }, { $push: { orders: order._id, history: order._id } }, { new: true }).select("-password -contactName -role -email")
                return res.json({ message: "Booking confirmed", status: "OK", order: populatedOrder, user, mistri });
            }
        }

    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            res.json({ status: "BAD", message: "Invalid token" });
        } else {
            res.json({ status: "BAD", message: "Server error" });
        }
    }
};


const createBooking = async (req, res) => {
    const data = req.body
    const User = req.user
    if (data) {
        try {
            const order = await orderModel.create({
                user: data.user,
                charges: data.Charges,
                totalAmount: data.Charges,
                orderTime: data.Time,
                orderDate: data.Date,
                profession: data.Profession
            })
            const user = await userModel.findOneAndUpdate({ _id: data.user }, { $push: { orders: order._id, history: order._id } }, { new: true }).select("-password -contactName -role -email")
            return res.json({ order: order, user })
        } catch (err) {
            res.json({ status: "BAD", message: err.message })
        }

    }
}
module.exports = { confirmBooking, getActiveBookings, createBooking } 
