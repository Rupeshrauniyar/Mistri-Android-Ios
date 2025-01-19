const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')
require("dotenv").config()

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

const verifyController = async (req, res) => {
    res.send("This is user verification page")
};





const resetController = async (req, res) => {
    res.send("This is user password reset page")
};



module.exports = { loginController, registerController, verifyController, resetController };