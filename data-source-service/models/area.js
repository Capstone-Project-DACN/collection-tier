const faker = require('faker')
const locationGenerator = require('../services/LocationGenerator')
const { DATA_TYPE, ALLOWED_DEVICE_ID } = require('../configs/DataConfig')
const randomHelper = require('../utils/RandomUtils')

const generateRandomAreaData = () => {
    const device_id = `${ALLOWED_DEVICE_ID.PREFIX}-${randomHelper.getRandomInt(ALLOWED_DEVICE_ID.START, ALLOWED_DEVICE_ID.END)}`
    const timestamp = new Date().toISOString()
    const { city, district, ward } = locationGenerator.generateRandomLocation()
    const total_electricity_usage_kwh = parseFloat(faker.finance.amount(5000, 10000, 2))
    const average_electricity_usage_kwh = parseFloat(faker.finance.amount(100, 500, 2))
    const max_electricity_usage_kwh = parseFloat(faker.finance.amount(500, 1000, 2))
    const min_electricity_usage_kwh = parseFloat(faker.finance.amount(50, 100, 2))

    return Promise.resolve({
        type: DATA_TYPE.area,
        device_id,
        timestamp,
        ward,
        district,
        city,
        total_electricity_usage_kwh,
        average_electricity_usage_kwh,
        max_electricity_usage_kwh,
        min_electricity_usage_kwh
    })
}

module.exports = {
    generateRandomAreaData
}
