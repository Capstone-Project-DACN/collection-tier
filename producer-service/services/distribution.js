const { DISTRIBUTIONS, BATCH_SIZE } = require('../configs/distributionConfig')

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
        case DISTRIBUTIONS.BIMODAL:
            batchSizes = bimodalBatchSizes(totalSlots, mean, BATCH_SIZE.MEAN1, stdDev, min, max)
            break
        case DISTRIBUTIONS.MULTIMODAL:
            batchSizes = multimodalBatchSizes(totalSlots, mean, stdDev, min, max, BATCH_SIZE.NUM_MODES)
            break
        case DISTRIBUTIONS.EXPONENTIAL:
            batchSizes = exponentialBatchSizes(totalSlots, min, max, BATCH_SIZE.LAMBDA)
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

const bimodalBatchSizes = (totalSlots, mean1, mean2, stdDev, min, max) => {
    const batchSizes = []
    const midPoint1 = Math.floor(totalSlots / 3)
    const midPoint2 = Math.floor((2 * totalSlots) / 3)
    const variance = stdDev * stdDev

    for (let i = 0; i < totalSlots; i++) {
        const x1 = i - midPoint1
        const x2 = i - midPoint2
        const peak1 = Math.exp(-x1 * x1 / (2 * variance)) * mean1
        const peak2 = Math.exp(-x2 * x2 / (2 * variance)) * mean2

        let biModalValue = (peak1 + peak2) / 2
        let batchSize = Math.round(biModalValue * max)
        batchSize = Math.max(min, batchSize)

        batchSizes.push(batchSize)
    }

    return batchSizes
}


const multimodalBatchSizes = (totalSlots, mean, stdDev, min, max, numModes) => {
    const batchSizes = []
    const interval = Math.floor(totalSlots / numModes)
    const variance = stdDev * stdDev

    for (let i = 0; i < totalSlots; i++) {
        const modeCenter = Math.floor((i % interval) * (totalSlots / interval))
        const x = i - modeCenter
        const modalValue = Math.exp(-x * x / (2 * variance)) * mean
        let batchSize = Math.round(modalValue * max)
        batchSize = Math.max(min, batchSize)
        batchSizes.push(batchSize)
    }

    return batchSizes
}

const exponentialBatchSizes = (totalSlots, min, max, lambda) => {
    const batchSizes = []
    for (let i = 0; i < totalSlots; i++) {
        const expValue = Math.exp(-lambda * i)
        let batchSize = Math.round(expValue * max)
        batchSize = Math.max(min, Math.min(batchSize, max))
        batchSizes.push(batchSize)
    }

    return batchSizes
}

module.exports = {
    generateBatchSizes
}
