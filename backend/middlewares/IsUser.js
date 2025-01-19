const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const mistriModel = require('../models/mistri.model.js')
const userModel = require('../models/user.model.js')


const isLoggedIn = async (req, res, next) => {
    const token = req.headers['token']
    if (!token) {
        return res.json({ status: "BAD", error: "Not authenticated" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT)
        if (decoded && decoded.username) {
            const user = await userModel.findOne({ username: decoded.username })
            if (!user) {
                 return res.json({ status: "BAD", error: "User not found" })
            }
            req.user = decoded
            next()

        } else {

            return res.json({ status: "BAD", message: "Not Logged in" })
        }
    } catch (error) {
        res.json({ status: "BAD", error: "Something went wrong" })
    }
}

module.exports = isLoggedIn