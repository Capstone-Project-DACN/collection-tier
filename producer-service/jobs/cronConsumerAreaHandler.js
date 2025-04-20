const { CronJob } = require('cron')
const dataTransferService = require('../services/DataTransferService')
const httpConsumerPolling = require('../services/httpConsumerPolling')
const { generateBatchSizes } = require('../services/distribution')
const { BatchSizeManager } = require('../services/BatchSize')
const { TIME } = require('../configs/cronConfig')
const { BATCH_SIZE } = require('../configs/distributionConfig')
const { DISTRIBUTIONS, RANDOM_ORDER } = require('../configs/distributionConfig')

const CRON_TAG = 'CRON_JOB_CONSUMER_AREA'
const CRON_TIME = process.env.CRON_TIME_CONSUMER_AREA
const IS_ENABLED = +process.env.CRON_CONSUMER_AREA_ENABLED

let isRunning = false
let cronJobConsumer
let batchSizesManager= new BatchSizeManager()
let distributionType = DISTRIBUTIONS.BELL_CURVE

const distributionArgs = [
    TIME.TOTAL_SLOTS,
    BATCH_SIZE.MEAN,
    BATCH_SIZE.STD_DEV,
    BATCH_SIZE.MIN,
    BATCH_SIZE.MAX,
    distributionType,
    RANDOM_ORDER
]

function init() {

    console.log('Initializing cron job...')
    
    batchSizesManager.initTimeSlot(
        CRON_TAG,
        generateBatchSizes,
        distributionArgs,
        distributionType
    )
    cronJobConsumer = new CronJob(CRON_TIME, async () => {

            await batchSizesManager.resetIfEndofTimeSlot(
                CRON_TAG,
                generateBatchSizes,
                distributionArgs,
                distributionType
            )
            const batch_size = batchSizesManager.getCurrentBatchSize()
            const current_slot = batchSizesManager.getCurrentSlot()

            await handle(batch_size, current_slot)

            batchSizesManager.updateTimeSlot()

    }, null, false)
}

function start() {
    cronJobConsumer.start()
    console.log(`---------${CRON_TAG} is running`)
}

function getBatchSize() {
    return {
        batchSizes: batchSizesManager.getBatchSizes(),
        distribution: batchSizesManager.getDistribution()
    }
}

// Function to fetch data and push to Kafka with proper error handling
const handle = async (batch_size, current_slot) => {
    console.log(`${CRON_TAG} ------started at: ${Date.now()}`)

    isRunning = true
    try {
        console.info(`${CRON_TAG} ------Info: batch_size=${batch_size}, current_slot=${current_slot}`)

        const data = await httpConsumerPolling.pollAreaData(batch_size)
        await dataTransferService.transferAreaData(data)

    } catch (error) {
        console.error(`${CRON_TAG} ------Error during data fetch or push:`, error)
    }
    console.log(`${CRON_TAG} ------ended at: ${Date.now()}`)
    isRunning = false
}

if (IS_ENABLED === 1) {
    init()
    start()
}

module.exports = {
    getBatchSize
}
