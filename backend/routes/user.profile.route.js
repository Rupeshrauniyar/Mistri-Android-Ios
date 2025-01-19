const express = require('express')
const app = express()
const router = express.Router();

const userController = require("../controllers/user.profile.controller.js")

router.get("/", userController.userProfileController)
router.get("/edit", userController.userProfileEditController)




app.use(router);
module.exports = router;