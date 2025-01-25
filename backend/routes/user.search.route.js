const express = require('express')

const router = express.Router()
const userSearchController = require("../controllers/user.search.controller")

router.post("/api/user/search", userSearchController)


module.exports = router