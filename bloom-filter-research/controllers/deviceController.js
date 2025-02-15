const bloomService = require("../services/bloomService")

const addDevice = (req, res) => {
    const { deviceId } = req.body
    bloomService.addDevice(deviceId)
    res.json({ message: "Device added" })
}

const checkDevice = (req, res) => {
    const result = bloomService.checkDevice(req.params.deviceId)
    res.json(result)
}

const removeDevice = (req, res) => {
    const { deviceId } = req.body
    bloomService.removeDevice(deviceId)
    res.json({ message: "Device removed" })
}

const addMultipleDevices = (req, res) => {
    const { start, end, prefix } = req.body

    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        return res.status(400).json({ error: "Start and end must be integers, and start must be less than or equal to end" })
    }

    bloomService.addMultipleDevices(start, end, prefix)
    res.json({ message: `Devices ${prefix}-${start} to ${prefix}-${end} added successfully` })
}

const getCurrentFalsePositiveRates = (req, res) => {
    const result = bloomService.getCurrentFalsePositiveRates()
    res.json(result)
}

module.exports = {
    addDevice,
    checkDevice,
    removeDevice,
    addMultipleDevices,
    getCurrentFalsePositiveRates
}
