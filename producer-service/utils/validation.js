const { ALLOWED_DEVICE_ID } = require('../configs/dataConfig')

function isValidDeviceId(deviceId) {
    if (typeof deviceId !== 'string') return false

    const regex = new RegExp(`^${ALLOWED_DEVICE_ID.PREFIX}-(\\d+)$`)
    const match = deviceId.match(regex)

    if (!match) return false

    const number = parseInt(match[1], 10)
    return number >= ALLOWED_DEVICE_ID.START && number <= ALLOWED_DEVICE_ID.END
}

function isValidDeviceIdFormat(start, end, prefix) {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        return false
    }

    if (typeof prefix !== 'string') {
        return false
    }

    if (start < 0 || start > ALLOWED_DEVICE_ID.START || end < 0 || end > ALLOWED_DEVICE_ID.END) {
        return false
    }

    return true
}

function getValidDeviceIdFormat() {
    return `Correct deviceId must follow ${JSON.stringify(ALLOWED_DEVICE_ID)}`
}

module.exports = {
    isValidDeviceId,
    isValidDeviceIdFormat,
    getValidDeviceIdFormat
}
