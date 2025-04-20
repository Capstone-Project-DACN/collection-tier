const express = require("express")
const deviceController = require("../controllers/deviceController")
const router = express.Router()

router.post("/add", deviceController.addDevice)
router.get("/check/:deviceId", deviceController.checkDevice)
router.post("/remove", deviceController.removeDevice)
router.post("/add-multiple", deviceController.addMultipleDevices)
router.get("/false-positive", deviceController.getCurrentFalsePositiveRates)
router.get('/graph-data', deviceController.getCurrentGraphData)
router.post('/reset', deviceController.resetAll)

module.exports = router
