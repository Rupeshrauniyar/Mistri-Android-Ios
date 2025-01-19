const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

// const employerModel = require('../models/employer.model.js')
const employerModel = require('../models/employer.model.js')


const isEmployer = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.json({ status: "BAD", error: "Not authenticated" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT)
        if (decoded && decoded.employername) {
            const employer = await employerModel.findOne({ username: decoded.employername })
            if (!employer) {
                return res.json({ status: "BAD", error: "employer not found" })
            }
            req.user = decoded
            next()
            return res.json({ status: "OK", message: "employer is Logged in" })
        }
        return res.json({ status: "OK", message: "employer is not Logged in" })


    } catch (error) {
        res.json({ status: "BAD", error: "Something went wrong" })
    }
}

module.exports = isEmployer