const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')
const passwordResetModel = require("../models/passwordReset.model.js")
require("dotenv").config()
const crypto = require("crypto")
const nodemailer = require('nodemailer')
const { userRegisterValidator } = require('../validators/user.validator.js')
const { loginValidator } = require('../validators/login.validator.js')

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate OTP
        const otp = (crypto.randomBytes(3).readUIntBE(0, 3) % 900000 + 100000).toString();
        const token = jwt.sign(email, process.env.JWT);
        const hashedOTP = jwt.sign(otp, process.env.JWT);
        const frontendUrl = process.env.FRONTEND_URL
        // Save reset data
        const passwordResetData = await passwordResetModel.create({
            email,
            token,
            otp: hashedOTP
        });

        if (!passwordResetData) {
            return res.status(500).json({
                success: false,
                message: "Failed to create reset data"
            });
        }

        // Create reset URL
        const resetURL = `${frontendUrl}/reset-password/${token}/${hashedOTP}/${passwordResetData._id}`;

        // Email template
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
      <div>
        <h2 style="color: #333; font-size: 28px; font-weight: bold;">Reset Your Password</h2>
      </div>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      <div style="margin: 30px 0;">
        <a
          
        style = "background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold;"
        href="${resetURL}"
            >
            Reset Password
        </a >
      </div >
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 15 minutes.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 12px;">
        This is an automated message. Please do not reply.
      </p>
    </div >
    `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Password reset email sent successfully"
        });

    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to send reset email"
        });
    }
};

const passwordResetController = async (req, res) => {
    try {
        const { password, email } = req.body
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