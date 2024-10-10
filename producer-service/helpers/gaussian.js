const gaussianRandom = (mean, standardDeviation) => {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * standardDeviation + mean
}

const generateBatchSizes = (totalSlots, mean, stdDev) => {
    const batchSizes = []
    for (let i = 0; i < totalSlots; i++) {
        const batchSize = Math.max(1, Math.round(gaussianRandom(mean, stdDev)))
        batchSizes.push(batchSize)
    }
    return batchSizes
}

module.exports = {
    gaussianRandom,
    generateBatchSizes
}
