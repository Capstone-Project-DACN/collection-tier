const dataHelper = require('../helpers/data')
const kafkaHelper = require('../helpers/kafka')
const config = require('../config')
const debugTag = 'PRODUCER'

const publishHouseHoldData = async (data) => {
    await kafkaHelper.publishMsg(config.TOPIC.HOUSEHOLD_DATA, data)
}

const publishAreaData = async (data) => {
    await kafkaHelper.publishMsg(config.TOPIC.AREA_DATA, data)
}

const publishAnomalyData = async (data) => {
    await kafkaHelper.publishMsg(config.TOPIC.ANOMALY_DATA, data)
}

const publishError = (type) => {
    console.error(`[${debugTag}] - publishError: Error unknown topic related to data with type=${type}`)
    throw new Error(`Error unknown topic related to data with type=${type}`)
}

const publishStrategies = {
    [config.DATA_TYPE.household]: publishHouseHoldData,
    [config.DATA_TYPE.area]: publishAreaData,
    [config.DATA_TYPE.anomaly]: publishAnomalyData,

}

const transferData = async () => {
    const data = await dataHelper.getData()
    if (!data) {
        throw new Error('Fetch no data from source')
    }

    const type = data?.type
    if (!publishStrategies[type]) {
        publishError(type)
    } else {
        await publishStrategies[type](data)
    }
}

module.exports = {
    transferData
}
