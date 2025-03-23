const bloomService = require('../services/redis')
const validationUtil = require('../utils/validation')

const debugTag = 'deviceController'

const addDevice = async (req, res) => {
    try {
        const { deviceId } = req.body

        if (!validationUtil.isValidDeviceId(deviceId)) {
            return res.status(400).json({ error: `Invalid device ID: ${deviceId}. ${validationUtil.getValidDeviceIdFormat()}` })
        }

        await bloomService.addDevice(deviceId)
        res.json({ message: 'Device added successfully' })
    } catch (error) {
        console.error(`[${debugTag}] addDevice error:`, error)
        res.status(500).json({ error: 'Failed to add device' })
    }
}

const checkDevice = async (req, res) => {
    try {
        const { deviceId } = req.body
        const result = await bloomService.checkDevice(deviceId)
        res.json({ exists: result })
    } catch (error) {
        console.error(`[${debugTag}] checkDevice error:`, error)
        res.status(500).json({ error: 'Failed to check device' })
    }
}

const removeDevice = async (req, res) => {
    try {
        const { deviceId } = req.body
        await bloomService.removeDevice(deviceId)
        res.json({ message: 'Device removed successfully' })
    } catch (error) {
        console.error(`[${debugTag}] removeDevice error:`, error)
        res.status(500).json({ error: 'Failed to remove device' })
    }
}

const addMultipleDevices = async (req, res) => {
    try {
        const { start, end, prefix } = req.body

        if (validationUtil.isValidDeviceIdFormat(start, end, prefix)) {
            return res.status(400).json({ error: `Invalid deviceId format. ${validationUtil.getValidDeviceIdFormat()}` })
        }

        await bloomService.addMultipleDevices(start, end, prefix)
        res.json({ message: `Devices ${prefix}-${start} to ${prefix}-${end} added successfully` })
    } catch (error) {
        console.error(`[${debugTag}] addMultipleDevices error:`, error)
        res.status(500).json({ error: 'Failed to add multiple devices' })
    }
}

const getInactiveDevices = async (req, res) => {
    try {
        const { pageNumber = 1, pageSize = 10 } = req.query

        const result = await bloomService.getInactiveDevices(pageNumber, pageSize)

        res.json(result)
    } catch (error) {
        console.error(`[${debugTag}] getInactiveDevices error:`, error)
        res.status(500).json({ error: 'Failed to get inactive devices' })
    }
}

module.exports = {
    addDevice,
    checkDevice,
    removeDevice,
    addMultipleDevices,
    getInactiveDevices
}
