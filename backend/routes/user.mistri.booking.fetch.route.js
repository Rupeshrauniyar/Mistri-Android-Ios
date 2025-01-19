const express = require('express')
const app = express()

const router = express.Router()
const userMistriFetchController = require("../controllers/user.mistri.booking.fetch.controller")

router.post("/", userMistriFetchController)

app.use(router)
module.exports = router 