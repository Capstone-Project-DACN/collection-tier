const express = require('express')
require('dotenv').config()

const dataCtrl = require('./controllers/dataController')

const app = express()
const port = +process.env.DATA_SOURCE_SERVICE_PORT || 3000

// Route to generate and return GPS data
app.get('/data', dataCtrl.createData)

// Start the server
app.listen(port, () => {
  console.log(`Data Source Service running at ${process.env.DATA_SOURCE_SERVICE_URL}`)
})
