const gaussianRandom = (mean, standardDeviation) => {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * standardDeviation + mean
}

const generateBatchSizes = (totalSlots, mean, stdDev, min, max) => {
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
    gaussianRandom,
    generateBatchSizes
};
