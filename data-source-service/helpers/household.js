const faker = require('faker')
const randomHelper = require('./random')
const locationGenerator = require('./locationGenerator')
const { DATA_TYPE, ALLOWED_DEVICE_ID } = require('./config')


const generateRandomHouseholdData = () => {
    const device_id = `${ALLOWED_DEVICE_ID.PREFIX}-${randomHelper.getRandomInt(ALLOWED_DEVICE_ID.START, ALLOWED_DEVICE_ID.END)}`
    const household_id = randomHelper.getRandomInt(1, 1000)
    const timestamp = new Date().toISOString()
    const electricity_usage_kwh = parseFloat(faker.finance.amount(0, 500, 2))
    const voltage = faker.datatype.number({ min: 220, max: 240 })
    const current = parseFloat(faker.finance.amount(0, 100, 2))
    const { city, district, ward } = locationGenerator.generateRandomLocation()
    const location = {
        house_number: faker.address.streetAddress(),
        ward: ward,
        district: district,
        city: city
    }

    const price_per_kwh = faker.datatype.number({ min: 1000, max: 5000 })
    const total_cost = Math.floor(electricity_usage_kwh * price_per_kwh)

    return Promise.resolve({
        type: DATA_TYPE.household,
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
    generateRandomHouseholdData
}
