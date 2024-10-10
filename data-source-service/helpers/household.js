const faker = require('faker')
const randomHelper = require('./random')

const generateRandomHouseholdData = () => {
    const household_id = randomHelper.getRandomInt(1, 1000)
    const timestamp = new Date().toISOString()
    const electricity_usage_kwh = parseFloat(faker.finance.amount(0, 500, 2))
    const voltage = faker.datatype.number({ min: 220, max: 240 })
    const current = parseFloat(faker.finance.amount(0, 100, 2))
    const location = {
        house_number: faker.address.streetAddress(),
        ward: faker.address.city(),
        district: faker.address.state()
    }

    const price_per_kwh = faker.datatype.number({ min: 1000, max: 5000 })
    const total_cost = Math.floor(electricity_usage_kwh * price_per_kwh)

    return Promise.resolve({
        type: "HouseholdData",
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
