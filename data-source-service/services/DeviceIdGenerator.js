const { DATA_TYPE, ALLOWED_DEVICE_ID } = require('../configs/DataConfig')
const randomHelper = require('../utils/RandomUtils')

/**
 * DEVICE ID rules
 * Household: household-<city_id>-<district_id>-[id range]
 * Area: area-<city_id>-<district_id>
 */
function generateRandomDeviceId(cityId, districtId, type = DATA_TYPE.household, id = null) {
    if (type === DATA_TYPE.household) {
        return `household-${cityId? cityId: 'undefined'}-${districtId? districtId: 'undefined'}-${ id? id: randomHelper.getRandomInt(ALLOWED_DEVICE_ID.START, ALLOWED_DEVICE_ID.END)}`
    } else if (type === DATA_TYPE.area) {
        return `area-${cityId? cityId: 'undefined'}-${districtId? districtId: 'undefined'}`
    } else {
        return `undefined-${cityId? cityId: 'undefined'}-${districtId? districtId: 'undefined'}`
    }
}

function isIdValid(id) {
    if (isNaN(Number(id))) {
        return false
    }
    return Number(id) >= ALLOWED_DEVICE_ID.START && Number(id) <= ALLOWED_DEVICE_ID.END
}

function getValidDeviceIdFormat() {
    return `Correct deviceId must follow household-<cityId>-<districtId>-${JSON.stringify({ start: ALLOWED_DEVICE_ID.START, end: ALLOWED_DEVICE_ID.END })} or area-<cityId>-<districtId>`
}

module.exports = {
    generateRandomDeviceId,
    isIdValid,
    getValidDeviceIdFormat
}
