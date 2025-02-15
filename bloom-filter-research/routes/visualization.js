const express = require("express")
const vizController = require("../controllers/vizController")
const router = express.Router()

router.get("/", vizController.renderFrontend)

module.exports = router
