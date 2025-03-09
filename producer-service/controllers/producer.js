const dataHelper = require('../helpers/data')
const kafkaHelper = require('../helpers/kafka')
const config = require('../config')
const debugTag = 'PRODUCER'

const publishHouseHoldData = async (data) => {
    await kafkaHelper.publishMsg(config.TOPIC.HOUSEHOLD_DATA, data, (item) => item?.location?.district || 'district-unknown')
}

const publishAreaData = async (data) => {
    await kafkaHelper.publishMsg(config.TOPIC.AREA_DATA, data, (item) => item?.district || 'district-unknown')
}

const publishAnomalyData = async (data) => {
    await kafkaHelper.publishMsg(config.TOPIC.ANOMALY_DATA, data, (item) => item?.location?.district || 'district-unknown')
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

const isDataExist = (data, type) => {
    if (!data || !Object.keys(data).length) {
        throw new Error(`Fetch no data ${type || 'random'} from source!`)
    }
}

const publishDataProcess = async (data) => {
    const batchPromises = []
    for (const [type, list_data] of Object.entries(data)) {
        if (!publishStrategies[type]) {
            publishError(type)
        } else {
            batchPromises.push(publishStrategies[type](list_data))
        }
    }

    await Promise.all(batchPromises)
}

const transferRandomData = async (batch_size) => {
    const data = await dataHelper.getData(null, batch_size)

    isDataExist(data)
    publishDataProcess(data)
}

const transferHouseholdData = async (batch_size) => {
    const data = await dataHelper.getData(config.DATA_TYPE_V2.household, batch_size)

    isDataExist(data)
    publishDataProcess(data)
}

const transferAreaData = async (batch_size) => {
    const data = await dataHelper.getData(config.DATA_TYPE_V2.area, batch_size)

    isDataExist(data)
    publishDataProcess(data)
}

const transferAnomalyData = async (batch_size) => {
    const data = await dataHelper.getData(config.DATA_TYPE_V2.area, batch_size)

    isDataExist(data)
    publishDataProcess(data)
}

module.exports = {
    transferRandomData,
    transferHouseholdData,
    transferAreaData,
    transferAnomalyData
}
