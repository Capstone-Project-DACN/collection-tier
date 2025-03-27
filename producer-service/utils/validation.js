const { ALLOWED_DEVICE_ID, DATA_TYPE } = require('../configs/dataConfig')

function isValidDeviceId(deviceId) {
    if (typeof deviceId !== 'string') return false

    const householdRegex = /^household-(.+?|undefined)-(.+?|undefined)-(\d+)$/
    const areaRegex = /^area-(.+?|undefined)-(.+?|undefined)$/

    let match = deviceId.match(householdRegex)
    if (match) {
        const number = parseInt(match[3], 10)
        return number >= ALLOWED_DEVICE_ID.START && number <= ALLOWED_DEVICE_ID.END
    }

    match = deviceId.match(areaRegex)
    if (match) {
        return true // No range check for area
    }

    return false
}

function isValidDeviceIdFormat(start, end, prefix) {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        return false
    }

    if (typeof prefix !== 'string') {
        return false
    }

    if (start < ALLOWED_DEVICE_ID.START || end > ALLOWED_DEVICE_ID.END) {
        return false
    }

    return isValidDeviceId(`${prefix}-${start}`)
}

function getValidDeviceIdFormat() {
    return `Correct deviceId must follow household-<cityId>-<districtId>-${JSON.stringify({ start: ALLOWED_DEVICE_ID.START, end: ALLOWED_DEVICE_ID.END })} or area-<cityId>-<districtId>`
}

module.exports = {
    isValidDeviceId,
    isValidDeviceIdFormat,
    getValidDeviceIdFormat,
}