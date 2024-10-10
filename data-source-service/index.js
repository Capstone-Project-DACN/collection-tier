const express = require('express')
require('dotenv').config()

const dataCtrl = require('./controllers/dataController')

const app = express()
const port = +process.env.DATA_SOURCE_SERVICE_PORT || 3000

// Route to generate and return GPS data
app.get('/data/random', dataCtrl.createData)
app.get('/data/household', dataCtrl.createHouseholdData)
app.get('/data/area', dataCtrl.createAreaData)
app.get('/data/anomaly', dataCtrl.createAnomalyData)

// Start the server
app.listen(port, () => {
  console.log(`Data Source Service running at ${process.env.DATA_SOURCE_SERVICE_URL}`)
})
