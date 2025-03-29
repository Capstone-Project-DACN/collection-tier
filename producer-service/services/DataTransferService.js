const { PRODUCER_IDS, TOPIC_PRODUCER, TOPIC_CONSUMER } = require("../configs/kafkaConfig")
const { DATA_TYPE } = require("../configs/dataConfig")
const kafkaProducerManager = require("./KafkaProducerManager")
const bloomService = require('./redis')

const debugTag = 'DataTransferService'

class DataTransferService {
    constructor() {
    }

    async #publishHouseHoldData(data, topic = TOPIC_PRODUCER.HOUSEHOLD) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS.HOUSEHOLD,
            topic,
            data,
            (item) => item?.location?.district || "district-unknown"
        )
    }

    async #publishAreaData(data, topic = TOPIC_PRODUCER.AREA) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS.AREA,
            topic,
            data,
            (item) => item?.district || "district-unknown"
        )
    }

    async #publishAnomalyData(data, topic = TOPIC_PRODUCER.ANOMALY) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS.ANOMALY,
            topic,
            data,
            (item) => item?.location?.district || "district-unknown"
        )
    }

    #checkEmptyBatch(data, type) {
        if (!data || data.length === 0) {
            throw new Error(`Poll no valid data ${type} from source!`)
        }
    }

    async #filterValidDevices(data) {
        const checks = data.map(async item => {
            const deviceId = item?.device_id
            if (!deviceId) return null

            const exists = await bloomService.checkDevice(deviceId)
            if (!exists) return null

            return item
        })

        const results = await Promise.all(checks)
        return results.filter(Boolean)
    }

    async #updateValidDevices(data) {
        const updatePromises = data.map(async item => {
            const deviceId = item?.device_id
            if (!deviceId) return null

            const metadata = {}

            if (item?.electricity_usage_kwh) { metadata.electricity_usage_kwh = item.electricity_usage_kwh }
            if (item?.voltage) { metadata.voltage = item.voltage }
            if (item?.current) { metadata.current = item.current }

            // For AreaData
            if (item?.total_electricity_usage_kwh) { metadata.total_electricity_usage_kwh = item.total_electricity_usage_kwh }

            await bloomService.updateLastSeen(deviceId, metadata)
            
            return item
        })

        await Promise.all(updatePromises)
    }

    #defineTargetTopic(sourceTopic) {
        const targetTopic = sourceTopic.split('_raw')[0]

        if (!targetTopic || Object.values(TOPIC_PRODUCER).indexOf(targetTopic) === -1) {
            console.error(`[${debugTag}] - publishError: Error unknown targetTopic=${targetTopic}`)
            throw new Error(`Error unknown targetTopic=${targetTopic}`)
        }

        return targetTopic
    }

    async transferHouseholdData(data, topic = TOPIC_CONSUMER.HOUSEHOLD) {
        this.#checkEmptyBatch(data, DATA_TYPE.household)
        const filteredData  = await this.#filterValidDevices(data)

        this.#checkEmptyBatch(filteredData, DATA_TYPE.household)
        await this.#updateValidDevices(filteredData)

        const targetTopic = this.#defineTargetTopic(topic)
        await this.#publishHouseHoldData(filteredData, targetTopic)
    }

    async transferAreaData(data, topic = TOPIC_CONSUMER.AREA) {
        this.#checkEmptyBatch(data, DATA_TYPE.area)
        const filteredData  = await this.#filterValidDevices(data)

        this.#checkEmptyBatch(filteredData, DATA_TYPE.area)
        await this.#updateValidDevices(filteredData)

        const targetTopic = this.#defineTargetTopic(topic)
        await this.#publishAreaData(filteredData, targetTopic)
    }

    async transferAnomalyData(data, topic = TOPIC_CONSUMER.ANOMALY) {
        this.#checkEmptyBatch(data, DATA_TYPE.anomaly)
        const filteredData  = await this.#filterValidDevices(data)
        
        this.#checkEmptyBatch(filteredData, DATA_TYPE.anomaly)
        await this.#updateValidDevices(filteredData)

        const targetTopic = this.#defineTargetTopic(topic)
        await this.#publishAnomalyData(filteredData, targetTopic)
    }
}

const dataTransferService = new DataTransferService()
module.exports = dataTransferService
