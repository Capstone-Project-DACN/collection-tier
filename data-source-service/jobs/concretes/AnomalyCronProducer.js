const { CronJob } = require('cron')
const dataService = require('../../services/DataService')
const distributionService = require('../../services/DistributionService')
const { BatchSizeManager } = require('../../services/BatchSizeManager')
const { ALLOWED_DEVICE_ID, DATA_TYPE } = require('../../configs/DataConfig')
const { TIME } = require('../../configs/DistributionConfig')

class AnomalyCronProducer {
    constructor(cityId, districtId, distributionType, randomOrder, cronTime, startId = ALLOWED_DEVICE_ID.START, endId = ALLOWED_DEVICE_ID.END, customDate = null) {
        this.cronType = DATA_TYPE.anomaly
        this.cityId = cityId
        this.districtId = districtId
        this.distributionType = distributionType
        this.randomOrder = randomOrder
        this.isRunning = false
        this.startId = startId
        this.endId = endId
        this.customDate = customDate
        this.batchManager = new BatchSizeManager(startId, endId)
        this.CRON_TAG = `CRON_JOB_PRODUCER_ANOMALY_${this.cityId}_${this.districtId}`

        this.job = new CronJob(cronTime, async () => {            
            await this.#handler()
        }, null, false)
    }

    async #handler() {
        console.log(`${this.CRON_TAG} ------started at: ${Date.now()}`)

        this.batchManager.resetIfEndofTimeSlot()

        try {
            console.info(`${this.CRON_TAG} ------Info: batch_size=${this.batchManager.getCurrentBatchSize()}, current_slot=${this.batchManager.getCurrentSlot()}`)

            await dataService.createAndSendAnomalyData(this.cityId, this.districtId, this.batchManager, this.customDate)

        } catch (error) {
            console.error(`${this.CRON_TAG} ------Error during process:`, error)
        }

        this.batchManager.updateTimeSlot()

        console.log(`${this.CRON_TAG} ------ended at: ${Date.now()}`)
    }

    init() {
        this.batchManager.initTimeSlot(
            this.CRON_TAG,
            distributionService.generateBatchSizes,
            [TIME.TOTAL_SLOTS, this.distributionType, this.randomOrder],
            this.distributionType
        )
    }

    start() {
        this.job.start()
        this.isRunning = true
    }

    stop() {
        this.job.stop()
        this.isRunning = false
    }
}

module.exports = AnomalyCronProducer
