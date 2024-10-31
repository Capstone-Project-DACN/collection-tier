const { DISTRIBUTIONS } = require('../config')

const generateBatchSizes = (totalSlots, mean, stdDev, min, max, distribution, randomOrder) => {
    let batchSizes = []
    const args = [totalSlots, mean, stdDev, min, max]

    if (distribution === DISTRIBUTIONS.BELL_CURVE) {
        batchSizes = bellCurveBatchSizes(...args)
    } else {
        throw new Error("Unsupported distribution type")
    }

    if (randomOrder) {
        for (let i = batchSizes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [batchSizes[i], batchSizes[j]] = [batchSizes[j], batchSizes[i]]
        }
    }

    return batchSizes
}

const bellCurveBatchSizes = (totalSlots, mean, stdDev, min, max) => {
    const batchSizes = []
    const midPoint = Math.floor(totalSlots / 2)
    const variance = stdDev * stdDev

    for (let i = 0; i < totalSlots; i++) {
        const x = i - midPoint
        const bellValue = Math.exp(-x * x / (2 * variance)) * mean

        let batchSize = bellValue
        batchSize = Math.round(batchSize * max)
        batchSize = Math.max(min, batchSize)

        batchSizes.push(batchSize)
    }

    return batchSizes
}

module.exports = {
    generateBatchSizes
}
