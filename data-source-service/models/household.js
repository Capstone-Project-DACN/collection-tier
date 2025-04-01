const faker = require('faker')
const { generateRandomDeviceId } = require('../services/DeviceIdGenerator')
const locationGenerator = require('../services/LocationGenerator')
const { DATA_TYPE } = require('../configs/DataConfig')
const RedisService = require('../services/RedisService')

const generateRandomHouseholdData = async (cityId, districtId, id = null) => {
    const device_id = generateRandomDeviceId(cityId, districtId, DATA_TYPE.household, id)
    const household_id = device_id
    const timestamp = new Date().toISOString()
    const voltage = faker.datatype.number({ min: 220, max: 240 })
    const current = parseFloat(faker.finance.amount(0, 100, 2))
    const { city, district, ward } = locationGenerator.generateRandomLocation(cityId, districtId)
    const location = {
        house_number: faker.address.streetAddress(),
        ward: ward,
        district: district,
        city: city
    }

    const previousElectricityUsage = await RedisService.getElectricityUsage(device_id)

    const increased_electricity_usage_kwh = parseFloat(faker.finance.amount(0, previousElectricityUsage ? 20 : 500, 2))
    const electricity_usage_kwh = parseFloat((previousElectricityUsage ? parseFloat(previousElectricityUsage) : 0) + increased_electricity_usage_kwh)
    
    const price_per_kwh = faker.datatype.number({ min: 1000, max: 5000 })
    const total_cost = Math.floor(electricity_usage_kwh * price_per_kwh)

    return Promise.resolve({
        type: DATA_TYPE.household,
        device_id,
        household_id,
        timestamp,
        electricity_usage_kwh,
        increased_electricity_usage_kwh,
        voltage,
        current,
        location,
        price_per_kwh,
        total_cost
    })
}

module.exports = {
    generateRandomHouseholdData
}
