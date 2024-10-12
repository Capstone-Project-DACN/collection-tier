const { getBatchSize } = require('../helpers/cron_job')

const viewTimeSeries = async (req, res) => {
    const batchSizes = getBatchSize()
    res.render('time-series', { batchSizes })
}

const viewHistogram = async (req, res) => {

    const batchSizes = getBatchSize()
    const numberOfBins = batchSizes.length

    const minBatchSize = Math.min(...batchSizes)
    const maxBatchSize = Math.max(...batchSizes)

    const binSize = (maxBatchSize - minBatchSize) / numberOfBins
    const bins = new Array(numberOfBins).fill(0)

    batchSizes.forEach(size => {
        const binIndex = Math.min(Math.floor((size - minBatchSize) / binSize), numberOfBins - 1)
        bins[binIndex] += 1
    });

    const binLabels = [];
    for (let i = 0; i < numberOfBins; i++) {
        const binStart = minBatchSize + i * binSize
        const binEnd = binStart + binSize
        binLabels.push([Math.round(binStart), Math.round(binEnd)])
    }

    res.render('histogram', { binLabels, bins })
}

module.exports = {
    viewTimeSeries,
    viewHistogram
}