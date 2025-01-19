const express = require('express')
const app = express()

const router = express.Router()
const userFavouriteController = require("../controllers/user.favourite.controller")

router.post("/", userFavouriteController.addToFavourite)

app.use(router)
module.exports = router