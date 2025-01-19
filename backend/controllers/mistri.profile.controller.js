const express = require('express')
const app = express()

const mistriModel = require('../models/mistri.model.js')


const mistriProfileController = async (req, res) => {
    res.send("This is mistri profile page")
};

const mistriProfileEditController = async (req, res) => {
    res.send("This is mistri profile edit page")
};

module.exports = { mistriProfileController, mistriProfileEditController }