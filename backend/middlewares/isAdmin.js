const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const adminModel = require('../models/admin.model.js')
// const userModel = require('../models/user.model.js')


const isadmin = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.json({ status: "BAD", error: "Not authenticated" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT)
        if (decoded && decoded.adminname) {
            const admin = await adminModel.findOne({ username: decoded.adminname })
            if (!admin) {
                return res.json({ status: "BAD", error: "admin not found" })
            }
            req.user = decoded
            next()
            return res.json({ status: "OK", message: "admin is Logged in" })
        }
        return res.json({ status: "OK", message: "admin is not Logged in" })


    } catch (error) {
        res.json({ status: "BAD", error: "Something went wrong" })
    }
}

module.exports = isadmin