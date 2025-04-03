const { CronJob } = require('cron')
const dataService = require('../../services/DataService')
const distributionService = require('../../services/DistributionService')
const { BatchSizeManager } = require('../../services/BatchSizeManager')
const { ALLOWED_DEVICE_ID } = require('../../configs/DataConfig')
const { DISTRIBUTIONS, TIME } = require('../../configs/DistributionConfig')

class HouseholdCronProducer {
    constructor(cityId, districtId, distributionType, randomOrder, cronTime, canStart) {
        this.cityId = cityId
        this.districtId = districtId
        this.distributionType = distributionType
        this.randomOrder = randomOrder
        this.canStart = canStart
        this.batchManager = new BatchSizeManager(ALLOWED_DEVICE_ID.START, ALLOWED_DEVICE_ID.END)
        this.CRON_TAG = `CRON_JOB_PRODUCER_HOUSEHOLD_${this.cityId}_${this.districtId}`

        this.job = new CronJob(cronTime, async () => {            
            await this.#handler()
        }, null, false)
    }

    async #handler() {
        console.log(`${this.CRON_TAG} ------started at: ${Date.now()}`)

        this.batchManager.resetIfEndofTimeSlot()

        try {
            console.info(`${this.CRON_TAG} ------Info: batch_size=${this.batchManager.getCurrentBatchSize()}, current_slot=${this.batchManager.getCurrentSlot()}`)

            await dataService.createAndSendHouseholdData(this.cityId, this.districtId, this.batchManager)

        } catch (error) {
            console.error(`${this.CRON_TAG} ------Error during process:`, error)
        }

        this.batchManager.updateTimeSlot()

        console.log(`${this.CRON_TAG} ------ended at: ${Date.now()}`)
    }

    start() {
        if (!this.canStart) return

        this.batchManager.initTimeSlot(
            this.CRON_TAG,
            distributionService.generateBatchSizes,
            [TIME.TOTAL_SLOTS, this.distributionType, this.randomOrder],
            this.distributionType
        )
        
        this.job.start()
    }

    stop() {
        this.job.stop()
    }
}

module.exports = HouseholdCronProducer
