const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const mistriModel = require('../models/mistri.model.js')
// const userModel = require('../models/user.model.js')


const isMistri = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        if (!token || token === null || token === undefined || token === "") {
            return res.status(501).json({ status: "BAD", error: "Not authenticated", loginStatus: false })
        } else {
            try {
                const decoded = jwt.verify(token, process.env.JWT)
                if (decoded && decoded.mistriId) {
                    const mistri = await mistriModel.findOne({ _id: decoded.mistriId }).select("-password")
                    if (!mistri) {
                        return res.json({ status: "BAD", error: "Mistri not found", loginStatus: false })
                    } else {
                        req.user = decoded
                        // res.json({ status: "OK", message: "Mistri is loggedin", loginStatus: true })
                        next()
                    }

                } else {
                    return res.json({ status: "BAD", message: "Mistri is not Logged in" })
                }
            } catch (err) {
                return res.json({ status: "BAD", error: "Invalid token", loginStatus: false })
            }


        }
    } catch (error) {
        res.json({ status: "BAD", error: "Something went wrong" })
    }

}


module.exports = isMistri