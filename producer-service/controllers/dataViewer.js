const fs = require('fs')
const path = require('path')
const { getBatchSize } = require('../helpers/cron_job')

const view = async (req, res) => {
    const batchSizes = getBatchSize()
    res.render('visualization', { batchSizes })
}

module.exports = {
    view
}