const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')
const passwordResetModel = require("../models/passwordReset.model.js")
require("dotenv").config()
const crypto = require("crypto")

const { userRegisterValidator } = require('../validators/user.validator.js')
const { loginValidator } = require('../validators/login.validator.js')

const loginController = async (req, res) => {
    try {
        const { error, value } = loginValidator.validate(req.body)
        if (error) {
            return res.json({ status: "BAD", message: error.details[0].message });
        }

        const { email, password } = value

        const user = await userModel.findOne({ email: email }).populate({
            path: "orders",
            populate: [
                { path: "user", select: "-contactNumber -password -email -role" },   // Populating user inside each order
                { path: "mistri", select: "-contactNumber -password -email -role" }  // Populating mistri inside each order
            ]
        }).populate({
            path: "acceptedOrder",
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
        })
        if (user) {
            bcrypt.compare(password, user.password, async function (err, result) {
                if (err) {
                    res.json({ status: "BAD", message: "Something went wrong" })
                    return
                } else {
                    try {
                        if (result) {
                            user.password = undefined;
                            const token = jwt.sign({ userId: user._id }, process.env.JWT)
                            if (token) {
                                res.json({ status: "OK", user, message: "Loggedin successfully", token: token })
                                return
                            } else {
                                res.json({ status: "BAD", message: "Something went wrong" })
                                return;
                            }

                        } else {
                            res.json({ status: "BAD", message: "Invalid credentials" })
                            return;
                        }

                    } catch (err) {
                        res.json({ status: "BAD", message: err.message })
                        return;
                    }

                }
            })
        } else {
            res.json({ status: "BAD", message: "Invalid credentials" })
            return
        }



    } catch (err) {
        return res.status(404).json({ status: "BAD", message: "Something went wrong" })
    }
};

const registerController = async (req, res) => {
    try {
        const { error, value } = userRegisterValidator.validate(req.body)

        if (error) {
            return res.json({ status: "BAD", message: error.details[0].message });
        }

        const { email, password, username, contactNumber, address } = value
        const user = await userModel.findOne({ email: email })
        if (user) {
            return res.json({ status: "BAD", message: "Email already exists" })
        } else {
            const userWithUsername = await userModel.findOne({ username: username })
            if (userWithUsername) {
                return res.json({ status: "BAD", message: "Username already exists" })
            } else {
                const userWithContactNumber = await userModel.findOne({ contactNumber: contactNumber })
                if (userWithContactNumber) {
                    return res.json({ status: "BAD", message: "Contact number already exists" })
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        if (err) {
                            res.json({ status: "BAD", message: "Something went wrong" })
                            return
                        } else {
                            bcrypt.hash(password, salt, async function (err, hashedPassword) {
                                if (err) {
                                    res.json({ status: "BAD", message: "Something went wrong" })
                                    return
                                } else {
                                    try {
                                        const newUser = await userModel.create({
                                            email: email,
                                            password: hashedPassword,
                                            username: username,
                                            contactNumber: contactNumber,
                                            address: address
                                        })
                                        if (newUser) {
                                            newUser.password = null;
                                            const token = jwt.sign({ userId: newUser._id }, process.env.JWT)
                                            if (token) {
                                                res.json({ status: "OK", message: "Account created successfully", token: token, user: newUser })
                                                return
                                            } else {
                                                res.json({ status: "BAD", message: "Account creation failed" })
                                                return;
                                            }

                                        } else {
                                            res.json({ status: "BAD", message: "Something went wrong" })
                                            return;

                                        }
                                    } catch (err) {
                                        res.json({ status: "BAD", message: "Something went wrong" })
                                        return;
                                    }

                                }
                            })
                        }

                    })

                }
            }
        }


    } catch (err) {
        return res.json({ status: "BAD", message: "Something went wrong" })
    }
};

const verifyPasswordResetController = async (req, res) => {
    try {
        const { token, otp, id } = req.body
        if (token && otp && id) {
            const verifyToken = jwt.verify(token, process.env.JWT)
            const verifyOTP = jwt.verify(otp, process.env.JWT)
            const getModel = await passwordResetModel.findOne({ _id: id })
            if (getModel) {
                const verifyModelOtp = jwt.verify(getModel.otp, process.env.JWT)
                const verifyModelToken = jwt.verify(getModel.token, process.env.JWT)
                if (verifyToken === verifyModelToken && verifyOTP === verifyModelOtp) {
                    res.json({ success: true, verified: true, email: getModel.email })
                } else {
                    res.json({ success: false, verified: false })
                }

            } else {
                res.json({ success: false, verified: false })
            }
            console.log(verifyToken, verifyOTP)
        } else {
            res.json({ success: false, verified: false })

        }
    } catch (err) {
        res.json({ success: false, verified: false })

    }
};


const forgotPasswordController = async (req, res) => {
    try {
        const Data = req.body
        console.log(Data.email)
        if (Data) {

            const otp = (crypto.randomBytes(3).readUIntBE(0, 3) % 900000 + 100000).toString();
            const token = jwt.sign(Data.email, process.env.JWT)
            const hashedOTP = jwt.sign(otp, process.env.JWT)


            const passwordResetData = await passwordResetModel.create({
                email: Data.email,
                token,
                otp: hashedOTP
            })
            if (passwordResetData) {
                const redirectURL = `http://localhost:5173/reset-password/${token}/${hashedOTP}/${passwordResetData._id}`
                res.json({ redirectURL, success: true })
            } else {
                res.status(404).json({ success: false, message: "Something went wrong while reseting password" })
            }



        }
    } catch (err) {
        res.status(401).json({ success: false, message: "Something went wrong while reseting password" })
    }
};

const passwordResetController = async (req, res) => {
    try {
        const { password,email } = req.body
        if (password, email) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    res.json({ status: "BAD", message: "Something went wrong", err })
                    return
                } else {
                    bcrypt.hash(password, salt, async function (err, hashedPassword) {
                        if (err) {
                            res.json({ status: "BAD", message: "Something went wrong", err })
                            return
                        } else {
                            try {
                                const user = await userModel.findOneAndUpdate({ email: email }, {
                                    password: hashedPassword
                                })
                                if (user) {
                                    res.json({ success: true })
                                } else {
                                    res.json({ success: false, msg: "Password reset faileddddd", err: "User not available" })

                                }
                            } catch (err) {
                                console.log(err)
                                res.json({ success: false, msg: "Password reset failedddd", err })

                            }

                        }
                    })
                }

            })


        } else {
            res.json({ success: false, msg: "Password reset failed" })

        }
    } catch (err) {
        console.log(err)
        res.json({ success: false, msg: "Password reset failed", err })
    }
}


module.exports = { loginController, registerController, verifyPasswordResetController, forgotPasswordController, passwordResetController };