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

const updateStatus = async (req, res) => {
    try {
        const { deviceId } = req.body

        if (!validationUtil.isValidDeviceId(deviceId)) {
            return res.status(400).json({ error: `Invalid device ID: ${deviceId}. ${validationUtil.getValidDeviceIdFormat()}` })
        }

        const isExists = await bloomService.checkDevice(deviceId)
        if (!isExists) {
            return res.status(404).json({ error: 'Device not found' })
        }

        await bloomService.updateLastSeen(deviceId)
        res.json({ message: 'Device updated status successfully' })
    } catch (error) {
        console.error(`[${debugTag}] updateStatus error:`, error)
        res.status(500).json({ error: 'Failed to update status' })
    }
}

const addMultipleDevices = async (req, res) => {
    try {
        const { start, end, prefix } = req.body

        if (!validationUtil.isValidDeviceIdFormat(start, end, prefix)) {
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
        const { pageNumber = 1, pageSize = 10, dateTime = false } = req.query

        const result = await bloomService.getInactiveDevices(pageNumber, pageSize, dateTime === 'true')

        res.json(result)
    } catch (error) {
        console.error(`[${debugTag}] getInactiveDevices error:`, error)
        res.status(500).json({ error: 'Failed to get inactive devices' })
    }
}

const getFalsePositiveCount = async (req, res) => {
    try {
        const count = await bloomService.getFalsePositiveCount()
        res.json({ false_positive_count: count })
    } catch (error) {
        console.error(`[${debugTag}] getFalsePositive error:`, error)
        res.status(500).json({ error: 'Failed to get false positive count'})
    }
}

const getDeviceDetail = async (req, res) => {
    try {
        const { deviceId } = req.params
        const detail = await bloomService.getDeviceDetail(deviceId)
        
        if (!detail) {
            return res.status(404).json({ error: 'Device not found' })
        }

        res.json(detail)
    } catch (error) {
        console.error(`[${debugTag}] getDeviceDetail error:`, error)
        res.status(500).json({ error: 'Failed to get device detail' })
    }
}

module.exports = {
    addDevice,
    checkDevice,
    removeDevice,
    updateStatus,
    addMultipleDevices,
    getInactiveDevices,
    getFalsePositiveCount,
    getDeviceDetail
}
