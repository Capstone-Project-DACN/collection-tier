const { CronJob } = require('cron')
const producerCtrl = require('../controllers/producer')
const { generateBatchSizes } = require('./gaussian')
const utils = require('./utils')
const { TIME_GAUSSIAN, BATCH_SIZE_GAUSSIAN } = require('../config')

const CRON_TAG = {
    TRANSFER_RANDOM_DATA: 'TRANSFER_RANDOM_DATA',
    TRANSFER_HOUSEHOLD_DATA: 'TRANSFER_HOUSEHOLD_DATA',
    TRANSFER_AREA_DATA: 'TRANSFER_AREA_DATA',
    TRANSFER_ANOMALY_DATA: 'TRANSFER_ANOMALY_DATA'
}
let transferRandomDataIsRunning = false
let transferHouseholdDataIsRunning = false
let transferAreaDataIsRunning = false
let transferAnomalyDataIsRunning = false

let cronJob1
let currentCronJob1Slot = 0
let batchSizesCronJob1 = []

function init() {

    console.log('Initializing cron job...')
    
    initTimeSlot('CRON_JOB_1')
    cronJob1 = new CronJob(process.env.cron_time_1, async () => {
            await resetIfEndofTimeSlot('CRON_JOB_1')
            const batch_size = batchSizesCronJob1[currentCronJob1Slot]

            // await transferRandomData(batch_size, currentCronJob1Slot)
            await transferHouseholdData(batch_size, currentCronJob1Slot)
            // await transferAreaData(batch_size, currentCronJob1Slot)
            // await transferAnomalyData(batch_size, currentCronJob1Slot)

            updateTimeSlot()

    }, null, false)
}

function start() {
    cronJob1.start()
    console.log('---------Cron job is running')
}

function initTimeSlot(TAG) {
    currentCronJob1Slot = 0
    batchSizesCronJob1 = generateBatchSizes(
        TIME_GAUSSIAN.TOTAL_SLOTS,
        BATCH_SIZE_GAUSSIAN.MEAN,
        BATCH_SIZE_GAUSSIAN.STD_DEV,
        BATCH_SIZE_GAUSSIAN.MIN,
        BATCH_SIZE_GAUSSIAN.MAX
    )
    console.log(`${TAG} Start sending all batches`)
}

function updateTimeSlot() {
    currentCronJob1Slot++
}

function getBatchSize() {
    return batchSizesCronJob1
}

async function resetIfEndofTimeSlot(TAG) {
    if (currentCronJob1Slot >= TIME_GAUSSIAN.TOTAL_SLOTS) {
        console.log(`${TAG} Finished sending all batches`)

        initTimeSlot(TAG)
    }
}

// Function to fetch data and push to Kafka with proper error handling
const transferRandomData = async (batch_size, current_slot) => {
    console.log(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------started at: ${Date.now()}`)

    transferRandomDataIsRunning = true
    try {
        console.info(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------Info: batch_size=${batch_size}, current_slot=${current_slot}`)
        await producerCtrl.transferRandomData(batch_size)
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------ended at: ${Date.now()}`)
    transferRandomDataIsRunning = false
}

const transferHouseholdData = async (batch_size, current_slot) => {
    console.log(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------started at: ${Date.now()}`)

    transferHouseholdDataIsRunning = true
    try {
        console.info(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------Info: batch_size=${batch_size}, current_slot=${current_slot}`)
        await producerCtrl.transferHouseholdData(batch_size)
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------ended at: ${Date.now()}`)
    transferHouseholdDataIsRunning = false
}

const transferAreaData = async (batch_size, current_slot) => {
    console.log(`${CRON_TAG.TRANSFER_AREA_DATA} ------started at: ${Date.now()}`)

    transferAreaDataIsRunning = true
    try {
        console.info(`${CRON_TAG.TRANSFER_AREA_DATA} ------Info: batch_size=${batch_size}, current_slot=${current_slot}`)
        await producerCtrl.transferAreaData(batch_size)
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_AREA_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_AREA_DATA} ------ended at: ${Date.now()}`)
    transferAreaDataIsRunning = false
}

const transferAnomalyData = async (batch_size, current_slot) => {
    console.log(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------started at: ${Date.now()}`)

    transferAnomalyDataIsRunning = true
    try {
        console.info(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------Info: batch_size=${batch_size}, current_slot=${current_slot}`)
        await producerCtrl.transferAnomalyData(batch_size)
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------ended at: ${Date.now()}`)
    transferAnomalyDataIsRunning = false
}

module.exports = {
    init,
    start,
    getBatchSize
}
