const { CronJob } = require('cron')
const producerHelper = require('./producer')
const dataCtrl = require('../controllers/dataController')

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
    
    console.log('Cron job is running')
}

// Function to fetch data and push to Kafka with proper error handling
const transferData = async () => {
    console.log(`${CRON_TAG.TRANSFER_DATA} ------started at: ${Date.now()}`)

    transferDataIsRunning = true
    try {
        const data = await dataCtrl.getData()
        if (data) {
            producerHelper.pushDatatoMQ(data)
        } else {
            throw Error('No data fetched from source')
        }
    } catch (error) {
        console.error(`${CRON_TAG.TRANSFER_DATA} ------Error during data fetch or push:`, error)
        transferDataIsRunning = false
    }

    console.log(`${CRON_TAG.TRANSFER_DATA} ------ended at: ${Date.now()}`)
}

module.exports = {
    init,
    start
}
