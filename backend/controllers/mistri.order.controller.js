const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require("dotenv").config()
const orderModel = require('../models/order.model.js')
const userModel = require("../models/user.model.js")
const mistriModel = require("../models/mistri.model.js")
const crypto = require("crypto")




const MistriSendOrderController = async (req, res) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT);


        const mistriId = decoded.mistriId
        if (mistriId) {
            const mistri = await mistriModel.findOne({ _id: mistriId }).populate({
                path: "orders",
                populate: [
                    { path: "user", select: "-contactNumber -password -email -role" },   // Populating user inside each order
                    { path: "mistri", select: " -contactNumber -password -email  -role" }  // Populating mistri inside each order
                ]
            }).select("-password")
            if (mistri && mistri.isVerified === true) {
                if (mistri.orders.length > 0) {
                    const mistriOrder = mistri.orders
                    return res.json({ message: "Your Order found", status: "OK", order: mistriOrder, isVerified: true, type: "my-order" });
                } else {
                    const order = await orderModel.find({ mistri: null }).populate("user mistri");
                    if (order && order.length > 0) {
                        return res.json({ message: "Universal Orders found", status: "OK", order, isVerified: true, type: "universal-order" });
                    } else {
                        return res.json({ message: "No order found", status: "OK", order, isVerified: true });
                    }
                }

            } else {
                return res.json({ message: "You are not verified", status: "BAD", isVerified: false });
            }
        } else {
            return res.json({ message: "Invalid ID", status: "BAD" });
        }
    } catch (error) {
        console.error(error);
        res.json({ message: "Server error.Please try again later." });
    }
};



// // Usage example
// generateSecureOTP(6)
//     .then(({  hashedOTP }) => {
//     })
//     .catch(err => {
//         console.error(err.message);
//     });

const MistriOrderAcceptController = async (req, res) => {
    try {
        const Data = req.body
        const length = 6
        try {
            if (length < 4 || length > 10) {
                throw new Error("OTP length should be between 4 and 10 digits.");
            }

            // Generate OTP
            const otp = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();

            // Generate salt and hash the OTP using async/await

            const hashedOTP = jwt.sign(otp, process.env.JWT)

            const receivedOrder = await orderModel.findById(Data.orderId)
            if (receivedOrder && !receivedOrder.mistri) {
                const order = await orderModel.findByIdAndUpdate(Data.orderId,
                    {
                        status: "accepted",
                        otp: hashedOTP,
                        mistri: Data.mistriId,
                    },
                    { new: true }).populate("user mistri").select("-password -contactName -role -email")
                const user = await userModel.findByIdAndUpdate(Data.userId, {
                    $push: { acceptedOrder: order._id },
                }, { new: true }).select("-password -contactName -role -email")
                const mistri = await mistriModel.findByIdAndUpdate(
                    Data.mistriId,
                    {
                        $push: { acceptedOrder: order._id },
                    },
                    { new: true }
                ).select("-password -contactName -role -email")
                res.json({ status: "OK", order, user, mistri, type: "universal" })
            } else {

                const order = await orderModel.findByIdAndUpdate(Data.orderId,
                    {
                        status: "accepted",
                        otp: hashedOTP,
                    },
                    { new: true }).populate("user mistri").select("-password -contactName -role -email")
                const user = await userModel.findByIdAndUpdate(Data.userId, {
                    $push: { acceptedOrder: order._id },
                }, { new: true }).select("-password -contactName -role -email")
                const mistri = await mistriModel.findByIdAndUpdate(
                    Data.mistriId,
                    {
                        $push: { acceptedOrder: order._id },


                    },
                    { new: true }
                ).select("-password -contactName -role -email")
                res.json({ status: "OK", order, user, mistri })
            }

        } catch (err) {
            return res.json({ status: "BAD", message: "Something went wrong" });
        }



    } catch (err) {
        res.json({ status: "BAD" })
    }

}
const MistriOrderRejectController = async (req, res) => {
    try {
        const Data = req.body
        // if(Data && Data.orderId)
        const receivedOrder = await orderModel.findById(Data.orderId)
        if (receivedOrder && !receivedOrder.mistri) {
            const updateMistri = await mistriModel.findOneAndUpdate({ _id: Data.mistriId }, {
                $push: { rejectedOrders: receivedOrder._id }
            }, { new: true }).populate("orders")
            return res.json({ status: "OK", mistri: updateMistri, type: "universal", message: "Order rejected successfully." })
        } else if (receivedOrder && receivedOrder.mistri) {
            const order = await orderModel.findByIdAndUpdate(Data.orderId, { status: "rejected" }, { new: true })
            const user = await userModel.findByIdAndUpdate(Data.userId, {
                $pull: { orders: order._id, acceptedOrder: order._id },
            }, { new: true })
            const mistri = await mistriModel.findByIdAndUpdate(Data.mistriId, {
                $pull: { orders: order._id, acceptedOrder: order._id },

            }, { new: true }).populate("orders")
            res.json({ status: "OK", mistri })
        }

    } catch (err) {
        res.json({ status: "BAD", message: err.message })
    }
}




module.exports = { MistriSendOrderController, MistriOrderAcceptController, MistriOrderRejectController }