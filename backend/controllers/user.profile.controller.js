const express = require('express')
const app = express()

const userModel = require('../models/user.model.js')

const userProfileController = async (req, res) => {
    res.send("This is user profile page")
};

const userProfileEditController = async (req, res) => {
    res.send("This is user profile edit page")
};


module.exports = {userProfileController, userProfileEditController}