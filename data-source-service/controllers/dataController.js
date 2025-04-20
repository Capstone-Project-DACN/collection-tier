const { generateRandomHouseholdData } = require('../models/household')
const { generateRandomAreaData } = require('../models/area')
const { generateRandomAnomalyData } = require('../models/anomaly')
const { isIdValid, getValidDeviceIdFormat } = require('../services/DeviceIdGenerator')
const { destinationTopic, topicExists } = require('../services/DestinationDeterminer')
const { DATA_TYPE } = require('../configs/DataConfig')
const { TOPIC, PRODUCER_IDS } = require('../configs/KafkaConfig')
const kafkaProducerManager = require('../services/KafkaProducer')
const ValidationUtils = require('../utils/ValidationUtils')

const TAG = 'dataController'

const createHouseholdData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const { city_id: cityId, district_id: districtId, display_data: displayData, id, custom_date: customDate } = req.query
    
    if (id !== undefined && !isIdValid(id)) {
        return res.status(403).json({
            error: `Invalid id. ${getValidDeviceIdFormat()}`
        })
    }

    if (customDate && !ValidationUtils.isValidCustomDate(customDate)) {
        return res.status(400).json({ error: 'Invalid custom_date format. The correct format is YYYY-MM-DD'})
    }

    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomHouseholdData(cityId, districtId, Number(id), customDate))
    }
    const batchResult = await Promise.all(batchData)
    console.info(`[${TAG}] Generated Household Data:`, batchResult.length)

    // Determind target topic
    const targetTopic = destinationTopic(cityId, districtId, DATA_TYPE.household)

    if (!topicExists(targetTopic)) {
        return res.status(403).json({
            error: 'Invalid city or district'
        })
    }

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.HOUSEHOLD], targetTopic, batchResult, null)

    const responseMessage = {
        target_topic: targetTopic,
        total_events: batchResult.length,
        [DATA_TYPE.household]: displayData === 'true' ? batchResult : []
    }

    return res.status(200).json(responseMessage)
}

const createAreaData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const { city_id: cityId, district_id: districtId, display_data: displayData, custom_date: customDate } = req.query
    
    if (customDate && !ValidationUtils.isValidCustomDate(customDate)) {
        return res.status(400).json({ error: 'Invalid custom_date format. The correct format is YYYY-MM-DD'})
    }
    
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAreaData(cityId, districtId, customDate))
    }
    const batchResult = await Promise.all(batchData)
    console.log(`[${TAG}] Generated Area Data:`, batchResult.length)

    // Determind target topic
    const targetTopic = destinationTopic(cityId, districtId, DATA_TYPE.area)

    if (!topicExists(targetTopic)) {
        return res.status(403).json({
            error: 'Invalid city or district'
        })
    }

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.AREA], targetTopic, batchResult, null)

    const responseMessage = {
        target_topic: targetTopic,
        total_events: batchResult.length,
        [DATA_TYPE.area]: displayData === 'true' ? batchResult : []
    }
    return res.status(200).json(responseMessage)
}

const createAnomalyData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const { city_id: cityId, district_id: districtId, display_data: displayData, id, custom_date: customDate } = req.query

    if (id !== undefined && !isIdValid(id)) {
        return res.status(403).json({
            error: `Invalid id. ${getValidDeviceIdFormat()}`
        })
    }

    if (customDate && !ValidationUtils.isValidCustomDate(customDate)) {
        return res.status(400).json({ error: 'Invalid custom_date format. The correct format is YYYY-MM-DD'})
    }

    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAnomalyData(cityId, districtId, Number(id), customDate))
    }
    const batchResult = await Promise.all(batchData)
    console.log(`[${TAG}] Generated Anomaly Data:`, batchResult.length)

    // Determind target topic
    const targetTopic = destinationTopic(cityId, districtId, DATA_TYPE.household)

    if (!topicExists(targetTopic)) {
        return res.status(403).json({
            error: 'Invalid city or district'
        })
    }

    // Publish messages to Kafka
    kafkaProducerManager.publishMsg(PRODUCER_IDS[TOPIC.ANOMALY], targetTopic, batchResult, null)

    const responseMessage = {
        target_topic: targetTopic,
        total_events: batchResult.length,
        [DATA_TYPE.anomaly]: displayData === 'true' ? batchResult : []
    }
    return res.status(200).json(responseMessage)
}

module.exports = {
    createHouseholdData,
    createAreaData,
    createAnomalyData
}
