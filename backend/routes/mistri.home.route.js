const express = require('express')
const app = express()
const router = express.Router();

const mistriHomeController = require("../controllers/mistri.home.controller.js")

// router.get("/fetch/order", mistriHomeController.mistriFetchMistriController) 
router.post("/check", mistriHomeController.checkController)
router.post("/fetch/universal-order", mistriHomeController.fetchUniversalOrder)
router.post("/fetch/accepted-order", mistriHomeController.fetchAcceptedOrder)
router.post("/fetch/order", mistriHomeController.fetchOrder)





app.use(router);
module.exports = router;