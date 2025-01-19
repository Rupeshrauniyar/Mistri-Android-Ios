const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');
const mistriModel = require('../models/mistri.model.js'); // Assuming this is the correct model for Mistri
require("dotenv").config();





// Display favourite Mistri
const displayFavourite = async (req, res) => {
    try {
        const mistri = await mistriModel.find({ isVerified: true }).select("-password -contactNumber -email -idProof -isVerified -createdAt -role -__v");

        if (mistri && mistri.length > 0) {
            return res.status(200).json({ message: "Mistri found", status: "OK", mistri });
        } else {
            return res.status(404).json({ message: "Mistri not found", status: "OK" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add to favourite
const addToFavourite = async (req, res) => {
    try {
        const data = req.body;
        const token = data.token
        const mistriId = data.mistriId

        const decoded = jwt.verify(token, process.env.JWT);  // Ensure you are using the correct secret
        const user = await userModel.findOne({ _id: decoded.userId })
        if (user && user.favourites.includes(data.mistriId)) {
            var removeFromFavourite = await userModel.findOneAndUpdate(
                { _id: decoded.userId },
                { $pull: { favourites: mistriId } },
                { new: true }  // Return the updated document
            ).select("-password");
        } else {
            var addToFavourite = await userModel.findOneAndUpdate(
                { _id: decoded.userId },
                { $push: { favourites: mistriId } },
                { new: true }  // Return the updated document
            ).select("-password");
        }


        if (removeFromFavourite) {
            res.json({ status: "OK", type: "remove", removeFromFavourite, message: "Removed from favourite" });
        } else if (addToFavourite) {
            res.json({ status: "OK", type: "add", addToFavourite, message: "Added to favourite" });

        } else {
            res.json({ status: "BAD", message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            res.json({ status: "BAD", message: "Invalid token" });
        } else {
            res.json({ status: "BAD", message: "Server error" });
        }
    }
};

module.exports = { displayFavourite, addToFavourite };
