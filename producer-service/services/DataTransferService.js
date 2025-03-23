const { TOPIC, PRODUCER_IDS } = require("../configs/kafkaConfig")
const { DATA_TYPE } = require("../configs/dataConfig")
const kafkaProducerManager = require("./KafkaProducerManager")
const bloomService = require('./redis')

const debugTag = 'DataTransferService'

class DataTransferService {
    constructor() {
    }

    async #publishHouseHoldData(data) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS[TOPIC.HOUSEHOLD_DATA],
            TOPIC.HOUSEHOLD_DATA,
            data,
            (item) => item?.location?.district || "district-unknown"
        )
    }

    async #publishAreaData(data) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS[TOPIC.AREA_DATA],
            TOPIC.AREA_DATA,
            data,
            (item) => item?.district || "district-unknown"
        )
    }

    async #publishAnomalyData(data) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS[TOPIC.ANOMALY_DATA],
            TOPIC.ANOMALY_DATA,
            data,
            (item) => item?.location?.district || "district-unknown"
        )
    }

    #publishError(type) {
        console.error(
            `[${debugTag}] - publishError: Error unknown topic related to data with type=${type}`
        )
        throw new Error(`Error unknown topic related to data with type=${type}`)
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

            await bloomService.updateLastSeen(deviceId)
            return item
        })

        await Promise.all(updatePromises)
    }

    async transferHouseholdData(data) {
        this.#checkEmptyBatch(data, DATA_TYPE.household)
        const filteredData  = await this.#filterValidDevices(data)

        this.#checkEmptyBatch(filteredData, DATA_TYPE.household)
        await this.#updateValidDevices(filteredData)

        await this.#publishHouseHoldData(filteredData)
    }

    async transferAreaData(data) {
        this.#checkEmptyBatch(data, DATA_TYPE.area)
        const filteredData  = await this.#filterValidDevices(data)

        this.#checkEmptyBatch(filteredData, DATA_TYPE.area)
        await this.#updateValidDevices(filteredData)

        await this.#publishAreaData(filteredData)
    }

    async transferAnomalyData(data) {
        this.#checkEmptyBatch(data, DATA_TYPE.anomaly)
        const filteredData  = await this.#filterValidDevices(data)
        
        this.#checkEmptyBatch(filteredData, DATA_TYPE.anomaly)
        await this.#updateValidDevices(filteredData)

        await this.#publishAnomalyData(filteredData)
    }
}

const dataTransferService = new DataTransferService()
module.exports = dataTransferService
