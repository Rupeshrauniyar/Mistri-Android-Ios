const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mistriModel = require('../models/mistri.model.js')
const { mistriRegisterValidator } = require('../validators/mistri.validator.js')
const { loginValidator } = require('../validators/login.validator.js')
const storage = require("../firebase.config.js")
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage")
const loginController = async (req, res) => {
    try {
        const { error, value } = loginValidator.validate(req.body)
        if (error) {
            return res.json({ status: "BAD", message: error.details[0].message });
        }

        const { email, password } = value


        const mistri = await mistriModel.findOne({ email: email }).populate({
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
        if (mistri) {
            bcrypt.compare(password, mistri.password, async function (err, result) {
                if (err) {
                    res.json({ status: "BAD", message: "Something went wrong" })
                    return
                } else {
                    try {
                        if (result) {
                            const token = jwt.sign({ mistriId: mistri._id }, process.env.JWT)
                            if (token) {
                                mistri.password = ""
                                res.json({ status: "OK", message: "Loggedin successfully", token: token, mistri })
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
        const { error, value } = mistriRegisterValidator.validate(req.body);
        if (error) {
            return res.json({ status: "BAD", message: error.details[0].message });
        }

        const { profileImage, idProof } = req.files;
        const { email, password, mistriname, contactNumber, address, profession, charges } = value;

        // Check for existing users
        const mistriWithEmail = await mistriModel.findOne({ email: email });
        if (mistriWithEmail) {
            res.json({ status: "BAD", message: "Email already exists" });
            return;
        }
        const mistriWithContact = await mistriModel.findOne({ contactNumber });
        if (mistriWithContact) {
            res.json({ status: "BAD", message: "Contact number already exists" });
            return;
        }

        // More checks here...

        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                res.json({ status: "BAD", message: "Something went wrong" });
                return;
            }

            bcrypt.hash(password, salt, async function (err, hashedPassword) {
                if (err) {
                    res.json({ status: "BAD", message: "Something went wrong" });
                    return;
                }

                try {
                    const uploadFile = async (file) => {
                        if (!file || !file.length) {
                            throw new Error("No file provided for upload");
                        }
                        const fileData = file[0];
                        const metadata = {
                            contentType: fileData.mimetype, // Set the correct MIME type
                        };
                        const fileRef = ref(storage, `files/${Date.now()}_${fileData.originalname}`);
                        const snapshot = await uploadBytes(fileRef, fileData.buffer, metadata);
                        return await getDownloadURL(snapshot.ref);
                    };

                    const profileImageURL = await uploadFile(profileImage);
                    const idProofURL = await uploadFile(idProof);

                    // Create a new user
                    const newmistri = await mistriModel.create({
                        email: email,
                        password: hashedPassword,
                        mistriname: mistriname,
                        contactNumber: contactNumber,
                        address,
                        idProof: idProofURL,
                        profileImage: "https://imgs.search.brave.com/oJmhCNRk22fQdZbu84cZUAGtfWey9UBMhi06dAXg6lw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jcmVhdGUtcGlj/dHVyZS10aGF0LXJl/cHJlc2VudHMtZGl2/ZXJzZS10ZWFtLWNv/bnN0cnVjdGlvbi13/b3JrZXJzLXN1Z2dl/c3RpbmctY29sbGFi/b3JhdGl2ZS1lXzkz/OTAzMy0xMDI1NDYu/anBnP3NpemU9NjI2/JmV4dD1qcGc",
                        profession,
                        charges
                    });

                    if (newmistri) {
                        newmistri.password = ""
                        const token = jwt.sign({ mistriId: newmistri._id }, process.env.JWT);
                        res.json({ status: "OK", message: "Account created successfully", token: token, mistri: newmistri });
                    } else {
                        res.json({ status: "BAD", message: "Something went wrong" });
                    }
                } catch (err) {
                    res.json({ status: "BAD", message: "Something went wrong" });
                }
            });
        });
    } catch (err) {
        return res.json({ status: "BAD", message: "Something went wrong" });
    }
};


const verifyController = async (req, res) => {
    res.send("This is mistri verification page")
};

const resetController = async (req, res) => {
    res.send("This is mistri password reset page")
};



module.exports = { loginController, registerController, verifyController, resetController };