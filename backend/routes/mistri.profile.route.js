const express = require('express')
const app = express()
const router = express.Router();

const mistriController = require("../controllers/mistri.profile.controller.js")
const isMistri = require("../middlewares/isMistri.js")
router.get("/", isMistri, mistriController.mistriProfileController)
router.get("/edit", isMistri, mistriController.mistriProfileEditController)



app.use(router);
module.exports = router;