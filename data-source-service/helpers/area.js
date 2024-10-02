const faker = require('faker')

const generateRandomAreaData = () => {
    const timestamp = new Date().toISOString()
    const ward = faker.address.city()
    const district = faker.address.state()
    const total_electricity_usage_kwh = parseFloat(faker.finance.amount(5000, 10000, 2))
    const average_electricity_usage_kwh = parseFloat(faker.finance.amount(100, 500, 2))
    const max_electricity_usage_kwh = parseFloat(faker.finance.amount(500, 1000, 2))
    const min_electricity_usage_kwh = parseFloat(faker.finance.amount(50, 100, 2))

    return Promise.resolve({
        type: 'AreaData',
        timestamp,
        ward,
        district,
        total_electricity_usage_kwh,
        average_electricity_usage_kwh,
        max_electricity_usage_kwh,
        min_electricity_usage_kwh
    })
}

module.exports = {
    generateRandomAreaData
}
