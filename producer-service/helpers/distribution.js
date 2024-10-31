const { DISTRIBUTIONS } = require('../config')

const generateBatchSizes = (totalSlots, mean, stdDev, min, max, distribution, randomOrder) => {
    let batchSizes = []
    const args = [totalSlots, mean, stdDev, min, max]

    switch (distribution) {
        case DISTRIBUTIONS.BELL_CURVE:
            batchSizes = bellCurveBatchSizes(...args)
            break
        case DISTRIBUTIONS.UNIFORM:
            batchSizes = uniformBatchSizes(totalSlots, min, max)
            break
        case DISTRIBUTIONS.LINEAR:
            batchSizes = linearBatchSizes(totalSlots, min, max)
            break
        default:
            throw new Error(`Unsupported distribution type ${distribution}`)
    }

    if (randomOrder) {
        for (let i = batchSizes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[batchSizes[i], batchSizes[j]] = [batchSizes[j], batchSizes[i]]
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

const uniformBatchSizes = (totalSlots, min, max) => {
    const batchSize = Math.round((min + max) / 2)
    return Array(totalSlots).fill(batchSize)
}

const linearBatchSizes = (totalSlots, min, max) => {
    const batchSizes = []
    const step = (max - min) / (totalSlots - 1)

    for (let i = 0; i < totalSlots; i++) {
        const batchSize = Math.round(min + i * step)
        batchSizes.push(batchSize)
    }

    return batchSizes
}

module.exports = {
    generateBatchSizes
}
