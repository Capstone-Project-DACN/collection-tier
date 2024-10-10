const fs = require('fs')
const path = require('path')
const { getBatchSize } = require('../helpers/cron_job')

const viewTimeSeries = async (req, res) => {
    const batchSizes = getBatchSize()
    res.render('time-series', { batchSizes })
}

const viewHistogram = async (req, res) => {
    const batchSizes = getBatchSize()
    res.render('histogram', { batchSizes })
}

module.exports = {
    viewTimeSeries,
    viewHistogram
}