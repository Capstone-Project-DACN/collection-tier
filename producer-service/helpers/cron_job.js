const { CronJob } = require('cron')
const producerCtrl = require('../controllers/producer')

const CRON_TAG = {
    TRANSFER_DATA: 'TRANSFER_DATA'
}
let transferDataIsRunning = false

let cronJob1

function init() {

    console.log('Initializing cron job...')
    
    cronJob1 = new CronJob(process.env.cron_time_1, async () => {
            await transferData()
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
const transferData = async () => {
    console.log(`${CRON_TAG.TRANSFER_DATA} ------started at: ${Date.now()}`)

    transferDataIsRunning = true
    try {
        await producerCtrl.transferData()
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_DATA} ------Error during data fetch or push:`, error?.message || error)
    }
    console.log(`${CRON_TAG.TRANSFER_DATA} ------ended at: ${Date.now()}`)
    transferDataIsRunning = false
}

module.exports = {
    init,
    start
}
