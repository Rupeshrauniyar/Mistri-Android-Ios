const express = require('express')
const app = express()
const router = express.Router();

const userHomeController = require("../controllers/user.home.controller.js")

router.get("/fetch/mistri", userHomeController.userFetchMistriController) 
router.post("/check", userHomeController.checkController)





app.use(router);
module.exports = router;