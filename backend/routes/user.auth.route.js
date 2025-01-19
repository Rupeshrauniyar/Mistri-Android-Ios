const express = require('express')
const app = express()
const router = express.Router();

const authController = require("../controllers/user.auth.controller.js")

router.post("/login", authController.loginController)
router.post("/register", authController.registerController)
router.get("/verify", authController.verifyController)
router.get("/reset", authController.resetController)




app.use(router);
module.exports = router;