const { generateRandomHouseholdData } = require('../models/household')
const { generateRandomAreaData } = require('../models/area')
const { generateRandomAnomalyData } = require('../models/anomaly')
const { DATA_TYPE } = require('../configs/DataConfig')
const { TOPIC, PRODUCER_IDS } = require('../configs/KafkaConfig')
const kafkaProducerManager = require('../services/KafkaProducer')

const TAG = 'dataController'

const createHouseholdData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomHouseholdData())
    }
    const batchResult = await Promise.all(batchData)
    console.log(`[${TAG}] Generated Household Data:`, batchResult.length)

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.HOUSEHOLD_DATA], TOPIC.HOUSEHOLD_DATA, batchResult, null)

    const groupedBatchResult = {
        [DATA_TYPE.household]: batchResult 
    }
    return res.status(200).json(groupedBatchResult)
}

const createAreaData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAreaData())
    }
    const batchResult = await Promise.all(batchData)
    console.log(`[${TAG}] Generated Area Data:`, batchResult.length)

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.AREA_DATA], TOPIC.AREA_DATA, batchResult, null)

    const groupedBatchResult = {
        [DATA_TYPE.area]: batchResult 
    }
    return res.status(200).json(groupedBatchResult)
}

const createAnomalyData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAnomalyData())
    }
    const batchResult = await Promise.all(batchData)
    console.log(`[${TAG}] Generated Anomaly Data:`, batchResult.length)

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.ANOMALY_DATA], TOPIC.ANOMALY_DATA, batchResult, null)

    const groupedBatchResult = {
        [DATA_TYPE.anomaly]: batchResult 
    }
    return res.status(200).json(groupedBatchResult)
}

module.exports = {
    createHouseholdData,
    createAreaData,
    createAnomalyData
}
