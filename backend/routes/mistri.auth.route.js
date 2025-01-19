const express = require('express')
const app = express()
const router = express.Router();

const authController = require("../controllers/mistri.auth.controller.js")
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
router.post("/login", authController.loginController)
router.post("/register", upload.fields([
    { name: 'profileImage' },   // Handle 'profileImage'
    { name: 'idProof' }         // Handle 'idProof'
]), authController.registerController)
router.get("/verify", authController.verifyController)
router.get("/reset", authController.resetController)



app.use(router);
module.exports = router;