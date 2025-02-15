const bloomService = require("../services/bloomService")

const addDevice = async (req, res) => {
    const { deviceId } = req.body
    await bloomService.addDevice(deviceId)
    res.json({ message: "Device added" })
}

const checkDevice = async (req, res) => {
    const result = await bloomService.checkDevice(req.params.deviceId)
    res.json(result)
}

const removeDevice = async (req, res) => {
    const { deviceId } = req.body
    await bloomService.removeDevice(deviceId)
    res.json({ message: "Device removed" })
}

const addMultipleDevices = async (req, res) => {
    const { start, end, prefix } = req.body

    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        return res.status(400).json({ error: "Start and end must be integers, and start must be less than or equal to end" })
    }

    await bloomService.addMultipleDevices(start, end, prefix)
    res.json({ message: `Devices ${prefix}-${start} to ${prefix}-${end} added successfully` })
}

const getCurrentFalsePositiveRates = async (req, res) => {
    const result = await bloomService.getCurrentFalsePositiveRates()
    res.json(result)
}

module.exports = {
    addDevice,
    checkDevice,
    removeDevice,
    addMultipleDevices,
    getCurrentFalsePositiveRates
}
