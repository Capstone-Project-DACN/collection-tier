const { generateRandomHouseholdData } = require('../models/household')
const { generateRandomAreaData } = require('../models/area')
const { generateRandomAnomalyData } = require('../models/anomaly')
const { isIdValid, getValidDeviceIdFormat } = require('./DeviceIdGenerator')
const { destinationTopic, topicExists } = require('./DestinationDeterminer')
const { DATA_TYPE } = require('../configs/DataConfig')
const { TOPIC, PRODUCER_IDS } = require('../configs/KafkaConfig')
const kafkaProducerManager = require('./KafkaProducer')
const { BatchSizeManager } = require('../services/BatchSizeManager')

const createAndSendHouseholdData = async (cityId, districtId, batchManager = new BatchSizeManager()) => {

    const batchData = []
    for (let i = 0; i < batchManager.getCurrentBatchSize(); i++) {
        const id = batchManager.getCurrentIndex()
        batchData.push(generateRandomHouseholdData(cityId, districtId, Number(id)))
        batchManager.updateCurrentIndex()
    }
    const batchResult = await Promise.all(batchData)

    // Determind target topic
    const targetTopic = destinationTopic(cityId, districtId, DATA_TYPE.household)

    if (!topicExists(targetTopic)) {
        throw Error('Invalid city or district')
    }

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.HOUSEHOLD], targetTopic, batchResult, null)
}

const createAndSendAreaData = async (cityId, districtId, batchSize) => {

    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAreaData(cityId, districtId))
    }
    const batchResult = await Promise.all(batchData)

    // Determind target topic
    const targetTopic = destinationTopic(cityId, districtId, DATA_TYPE.area)

    if (!topicExists(targetTopic)) {
        throw Error('Invalid city or district')
    }

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.AREA], targetTopic, batchResult, null)
}

const createAndSendAnomalyData = async (cityId, districtId, batchManager = new BatchSizeManager()) => {

    const batchData = []
    for (let i = 0; i < batchManager.getCurrentBatchSize(); i++) {
        const id = batchManager.getCurrentIndex()
        batchData.push(generateRandomAnomalyData(cityId, districtId, Number(id)))
        batchManager.updateCurrentIndex()
    }
    const batchResult = await Promise.all(batchData)

    // Determind target topic
    const targetTopic = destinationTopic(cityId, districtId, DATA_TYPE.household)

    if (!topicExists(targetTopic)) {
        throw Error('Invalid city or district')
    }

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.ANOMALY], targetTopic, batchResult, null)
}

module.exports = {
    createAndSendHouseholdData,
    createAndSendAreaData,
    createAndSendAnomalyData
}
