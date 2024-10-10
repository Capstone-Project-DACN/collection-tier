require('dotenv').config()
const express = require('express')
const cron = require('./helpers/cron_job')
const kafkaHelper = require('./helpers/kafka')
const dataViewerCtrl = require('./controllers/dataViewer')
const path = require('path')

const app = express()
const PORT = +process.env.PRODUCER_SERVICE_PORT || 3001

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

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

app.get('/view', dataViewerCtrl.view)

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.PRODUCER_SERVICE_URL}`)
})
