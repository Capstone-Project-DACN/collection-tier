const { TOPIC, PRODUCER_IDS } = require("../configs/kafkaConfig")
const { DATA_TYPE } = require("../configs/dataConfig")
const kafkaProducerManager = require("./KafkaProducerManager")

const debugTag = 'DataTransferService'

class DataTransferService {
    constructor() {
        this.publishStrategies = {
            [DATA_TYPE.household]: this.publishHouseHoldData.bind(this),
            [DATA_TYPE.area]: this.publishAreaData.bind(this),
            [DATA_TYPE.anomaly]: this.publishAnomalyData.bind(this),
        }
    }

    async publishHouseHoldData(data) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS[TOPIC.HOUSEHOLD_DATA],
            TOPIC.HOUSEHOLD_DATA,
            data,
            (item) => item?.location?.district || "district-unknown"
        )
    }

    async publishAreaData(data) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS[TOPIC.AREA_DATA],
            TOPIC.AREA_DATA,
            data,
            (item) => item?.district || "district-unknown"
        )
    }

    async publishAnomalyData(data) {
        await kafkaProducerManager.publishMsg(
            PRODUCER_IDS[TOPIC.ANOMALY_DATA],
            TOPIC.ANOMALY_DATA,
            data,
            (item) => item?.location?.district || "district-unknown"
        )
    }

    publishError(type) {
        console.error(
            `[${debugTag}] - publishError: Error unknown topic related to data with type=${type}`
        )
        throw new Error(`Error unknown topic related to data with type=${type}`)
    }

    isDataExist(data, type) {
        if (!data || !Object.keys(data).length) {
            throw new Error(`Fetch no data ${type || "random"} from source!`)
        }
    }

    async publishDataProcess(data) {
        const batchPromises = []
        for (const [type, list_data] of Object.entries(data)) {
            if (!this.publishStrategies[type]) {
                this.publishError(type)
            } else {
                batchPromises.push(this.publishStrategies[type](list_data))
            }
        }

        await Promise.all(batchPromises)
    }

    async transferData(data, type) {
        this.isDataExist(data, type)
        await this.publishDataProcess(data)
    }

    async transferHouseholdData(data) {
        await this.transferData(data, DATA_TYPE.household)
    }

    async transferAreaData(data) {
        await this.transferData(data, DATA_TYPE.area)
    }

    async transferAnomalyData(data) {
        await this.transferData(data, DATA_TYPE.anomaly)
    }
}

const dataTransferService = new DataTransferService()
module.exports = dataTransferService
