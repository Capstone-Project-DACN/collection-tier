const { TOPIC, PRODUCER_IDS } = require("../configs/kafkaConfig")
const { DATA_TYPE } = require("../configs/dataConfig")
const kafkaProducerManager = require("./KafkaProducerManager")
const bloomService = require('./redis')

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

    async filterAndUpdateStatusValidDevices(data) {
        const filteredData = {}
    
        for (const [type, list_data] of Object.entries(data)) {
            const checks = list_data.map(async item => {
                const deviceId = item?.device_id
                if (!deviceId) return null
    
                const exists = await bloomService.checkDevice(deviceId)
                if (!exists) return null
    
                await bloomService.updateLastSeen(deviceId)
                return item
            })
    
            const results = await Promise.all(checks)
            filteredData[type] = results.filter(Boolean)
        }
    
        return filteredData
    }

    async transferData(data, type) {
        this.isDataExist(data, type)
        const filteredData = await this.filterAndUpdateStatusValidDevices(data)
        await this.publishDataProcess(filteredData)
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
