const faker = require('faker')
const { generateRandomDeviceId } = require('../services/DeviceIdGenerator')
const locationGenerator = require('../services/LocationGenerator')
const { DATA_TYPE } = require('../configs/DataConfig')

const generateRandomAreaData = (cityId, districtId) => {
    const device_id = generateRandomDeviceId(cityId, districtId, DATA_TYPE.area)
    const timestamp = new Date().toISOString()
    const { city, district, ward } = locationGenerator.generateRandomLocation(cityId, districtId)
    const total_electricity_usage_kwh = parseFloat(faker.finance.amount(5000, 10000, 2))

    return Promise.resolve({
        type: DATA_TYPE.area,
        device_id,
        timestamp,
        ward,
        district,
        city,
        total_electricity_usage_kwh
    })
}

module.exports = {
    generateRandomAreaData
}
