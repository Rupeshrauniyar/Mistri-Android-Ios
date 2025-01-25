const express = require('express')
const app = express()

const router = express.Router()
const userBookingController = require("../controllers/user.booking.controller")


router.post("/confirm", userBookingController.confirmBooking)
router.post("/fetch/active", userBookingController.getActiveBookings)
router.post("/create", userBookingController.createBooking)


app.use(router)
module.exports = router