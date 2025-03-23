require('dotenv').config()
const express = require('express')
const dataViewerCtrl = require('./controllers/dataViewer')
const deviceCtrl = require('./controllers/deviceController')
const consumerHouseHoldHandler = require('./consumers/streams/consumerHouseHoldHandler')
const consumerAreaHandler = require('./consumers/streams/consumerAreaHandler')
const consumerAnomalyHandler = require('./consumers/streams/consumerAnomalyHandler')
const path = require('path')

const app = express()
const PORT = +process.env.PRODUCER_SERVICE_PORT || 3001

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware
app.use(express.json())

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the Cron Job Express App!')
})

app.get('/view/time-series', dataViewerCtrl.viewTimeSeries)
app.get('/view/histogram', dataViewerCtrl.viewHistogram)

// Device controller
app.post('/devices/add', deviceCtrl.addDevice)
app.post('/devices/check', deviceCtrl.checkDevice)
app.post('/devices/remove', deviceCtrl.removeDevice)
app.post('/devices/update-status', deviceCtrl.updateStatus)
app.post('/devices/add-multiple', deviceCtrl.addMultipleDevices)
app.get('/devices/inactive', deviceCtrl.getInactiveDevices)

// Start Kafka Consumers
consumerHouseHoldHandler.init()
consumerAreaHandler.init()
consumerAnomalyHandler.init()

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.PRODUCER_SERVICE_URL}`)
})
