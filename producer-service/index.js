require('dotenv').config()
const express = require('express')
const cron = require('./helpers/cron_job')
const kafkaHelper = require('./helpers/kafka')

const app = express()
const PORT = +process.env.PRODUCER_SERVICE_PORT || 3001

// Middleware
app.use(express.json())

// Kafka connect
kafkaHelper.singleToneConnect()

// Initialize the cron job
cron.init()
cron.start()

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the Cron Job Express App!')
})

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.PRODUCER_SERVICE_URL}`)
})
