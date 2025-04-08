const express = require('express')
require('dotenv').config()

const dataCtrl = require('./controllers/dataController')
const cronCtrl = require('./controllers/cronController')

const app = express()
const port = +process.env.DATA_SOURCE_SERVICE_PORT || 3000

// Enable CORS for all origins
app.use(cors())

// Route to generate and return electric data
app.get('/data/household', dataCtrl.createHouseholdData)
app.get('/data/area', dataCtrl.createAreaData)
app.get('/data/anomaly', dataCtrl.createAnomalyData)

// Route to control cron creating electric data
app.post('/jobs/update', cronCtrl.updateCronInfo)
app.post('/jobs/trigger', cronCtrl.triggerCronStatus)
app.get('/jobs/all', cronCtrl.getJobs)
app.get('/jobs/detail', cronCtrl.getJobDetail)
app.get('/jobs/distribution-types/all', cronCtrl.getAvailableDistributionType)
app.get('/jobs/chart', cronCtrl.getChartInfo)

// Start the server
app.listen(port, () => {
  console.log(`Data Source Service running at ${process.env.DATA_SOURCE_SERVICE_URL}`)
})
