const gaussianRandom = (mean, standardDeviation) => {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * standardDeviation + mean
}

const generateBatchSizes = (totalSlots, mean, stdDev, min, max) => {
    const batchSizes = []
    for (let i = 0; i < totalSlots; i++) {
        let batchSize
        do {
            batchSize = Math.round(gaussianRandom(mean, stdDev))
        } while (batchSize < min || batchSize > max)
            
        batchSizes.push(batchSize)
    }
    return batchSizes
}

module.exports = {
    gaussianRandom,
    generateBatchSizes
}
