const express = require('express')
const app = express()
const router = express.Router();

const mistriOrderController = require("../controllers/mistri.order.controller.js")
const isMistri = require("../middlewares/isMistri.js")
// const ismistri = require(`../middlewares/ismistri.js`)

router.get("/", isMistri, mistriOrderController.MistriSendOrderController)
router.post("/accept", isMistri, mistriOrderController.MistriOrderAcceptController)
router.post("/reject", isMistri, mistriOrderController.MistriOrderRejectController)



app.use(router);
module.exports = router;