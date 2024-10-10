const { CronJob } = require('cron')
const producerCtrl = require('../controllers/producer')

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

function init() {

    console.log('Initializing cron job...')
    
    cronJob1 = new CronJob(process.env.cron_time_1, async () => {
            // await transferRandomData()
            await transferHouseholdData()
            // await transferAreaData()
            // await transferAnomalyData()
        },
        null,
        false
    )
}

function start() {
    cronJob1.start()
    console.log('---------Cron job is running')
}

// Function to fetch data and push to Kafka with proper error handling
const transferRandomData = async () => {
    console.log(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------started at: ${Date.now()}`)

    transferRandomDataIsRunning = true
    try {
        await producerCtrl.transferRandomData()
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_RANDOM_DATA} ------ended at: ${Date.now()}`)
    transferRandomDataIsRunning = false
}

const transferHouseholdData = async () => {
    console.log(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------started at: ${Date.now()}`)

    transferHouseholdDataIsRunning = true
    try {
        await producerCtrl.transferHouseholdData()
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_HOUSEHOLD_DATA} ------ended at: ${Date.now()}`)
    transferHouseholdDataIsRunning = false
}

const transferAreaData = async () => {
    console.log(`${CRON_TAG.TRANSFER_AREA_DATA} ------started at: ${Date.now()}`)

    transferAreaDataIsRunning = true
    try {
        await producerCtrl.transferAreaData()
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_AREA_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_AREA_DATA} ------ended at: ${Date.now()}`)
    transferAreaDataIsRunning = false
}

const transferAnomalyData = async () => {
    console.log(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------started at: ${Date.now()}`)

    transferAnomalyDataIsRunning = true
    try {
        await producerCtrl.transferAnomalyData()
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_ANOMALY_DATA} ------ended at: ${Date.now()}`)
    transferAnomalyDataIsRunning = false
}

module.exports = {
    init,
    start
}
