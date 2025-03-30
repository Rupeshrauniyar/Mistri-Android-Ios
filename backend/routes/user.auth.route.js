const express = require('express')
const app = express()
const router = express.Router();

const authController = require("../controllers/user.auth.controller.js")

router.post("/login", authController.loginController)
router.post("/register", authController.registerController)
router.post("/reset-password", authController.verifyPasswordResetController)
router.post("/forgot-password", authController.forgotPasswordController)
router.post("/update-password", authController.passwordResetController)





app.use(router);
module.exports = router;