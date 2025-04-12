const { ALLOWED_DEVICE_ID, ALLOWED_LOCATIONS } = require('../configs/dataConfig')

function isValidDeviceId(deviceId) {
    if (typeof deviceId !== 'string') return false

    const householdRegex = /^household-(.+?|undefined)-(.+?|undefined)-(\d+)$/
    const areaRegex = /^area-(.+?|undefined)-(.+?|undefined)$/

    let match = deviceId.match(householdRegex)
    if (match) {
        const number = parseInt(match[3], 10)
        return isValidLocation(match[1], match[2]) &&
            number >= ALLOWED_DEVICE_ID.START && number <= ALLOWED_DEVICE_ID.END
    }

    match = deviceId.match(areaRegex)
    if (match) {
        return isValidLocation(match[1], match[2])
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

function isValidLocation(cityId, districtId) {
    const city = ALLOWED_LOCATIONS.find(city => city.city_id === cityId)
    if (!city) {
        return false
    }

    const district = city.districts.find(district => district.district_id === districtId)
    
    if (!district) {
        return false
    }

    return true
}

module.exports = {
    isValidDeviceId,
    isValidDeviceIdFormat,
    getValidDeviceIdFormat,
}