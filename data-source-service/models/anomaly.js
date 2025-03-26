const faker = require('faker')
const { generateRandomDeviceId } = require('../services/DeviceIdGenerator')
const locationGenerator = require('../services/LocationGenerator')
const { DATA_TYPE } = require('../configs/DataConfig')

const generateRandomAnomalyData = (cityId, districtId) => {
    const device_id = generateRandomDeviceId(cityId, districtId, DATA_TYPE.household)
    const household_id = device_id
    const timestamp = new Date().toISOString()
    const electricity_usage_kwh = parseFloat(faker.finance.amount(5000, 10000, 2)) // Extremely high usage
    const voltage = faker.datatype.number({ min: 400, max: 500 }) // Dangerously high voltage
    const current = parseFloat(faker.finance.amount(300, 500, 2)) // Dangerously high current
    const { city, district, ward } = locationGenerator.generateRandomLocation(cityId, districtId)
    const location = {
        house_number: faker.address.streetAddress(),
        ward: ward,
        district: district,
        city: city
    }

    const price_per_kwh = faker.datatype.number({ min: 1000, max: 5000 })
    const total_cost = Math.floor(electricity_usage_kwh * price_per_kwh)

    return Promise.resolve({
        type: DATA_TYPE.anomaly,
        device_id,
        household_id,
        timestamp,
        electricity_usage_kwh,
        voltage,
        current,
        location,
        price_per_kwh,
        total_cost
    })
}

module.exports = {
    generateRandomAnomalyData
}
