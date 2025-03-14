const faker = require('faker')
const randomHelper = require('../utils/RandomUtils')
const { DATA_TYPE, ALLOWED_DEVICE_ID } = require('../configs/DataConfig')

const generateRandomAnomalyData = () => {
    const device_id = `${ALLOWED_DEVICE_ID.PREFIX}-${randomHelper.getRandomInt(ALLOWED_DEVICE_ID.START, ALLOWED_DEVICE_ID.END)}`
    const household_id = randomHelper.getRandomInt(1, 1000)
    const timestamp = new Date().toISOString()
    const electricity_usage_kwh = parseFloat(faker.finance.amount(0, 500, 2))
    const current = parseFloat(faker.finance.amount(0, 100, 2))
    const voltage = faker.datatype.number({ min: 220, max: 240 })
    const anomaly_type = faker.random.arrayElement(['Overvoltage', 'Undervoltage', 'Overcurrent', 'Power Surge'])
    const description = faker.lorem.sentence()

    return Promise.resolve({
        type: DATA_TYPE.anomaly,
        device_id,
        household_id,
        timestamp,
        electricity_usage_kwh,
        current,
        voltage,
        anomaly_type,
        description
    })
}

module.exports = {
    generateRandomAnomalyData
}
