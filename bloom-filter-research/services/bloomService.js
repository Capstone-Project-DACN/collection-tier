const { BloomFilter, CountingBloomFilter, ScalableBloomFilter } = require("bloom-filters")
const { logPerformance } = require("../utils/logger")
const { SIZE, NUMBER_OF_HASHES, STEP_SIZE } = require('../configs/generalConfig')
const { SCALE_SIZE, ERROR_RATE, RATIO } = require('../configs/scalableBloomFilterConfig')

let traditionalBF = new BloomFilter(SIZE, NUMBER_OF_HASHES)
let countingBF = new CountingBloomFilter(SIZE, NUMBER_OF_HASHES)
let scalableBF = new ScalableBloomFilter()

const devices = new Set()  // Track actual devices for false positive analysis
let graphData = {
    xAxis: [],
    traditional: [],
    counting: [],
    scalable: []
}

const updateGraphData = () => {
    if (devices.size % STEP_SIZE === 0) {
        graphData.xAxis.push(devices.size)
        graphData.traditional.push(traditionalBF.rate())
        graphData.counting.push(countingBF.rate())
        graphData.scalable.push(scalableBF.rate())
    }
}

const resetAll = async () => {
    logPerformance("Reset all devices's data", null)

    traditionalBF = new BloomFilter(SIZE, NUMBER_OF_HASHES)
    countingBF = new CountingBloomFilter(SIZE, NUMBER_OF_HASHES)
    scalableBF = new ScalableBloomFilter()

    devices.clear()

    graphData = {
        xAxis: [],
        traditional: [],
        counting: [],
        scalable: []
    }
}

const addDevice = async (deviceId) => {
    logPerformance("Adding device", deviceId)

    await Promise.all([
        traditionalBF.add(deviceId),
        countingBF.add(deviceId),
        scalableBF.add(deviceId)
    ])
    
    devices.add(deviceId)
    updateGraphData()
}

const checkDevice = async (deviceId) => {
    const result = {
        traditional: traditionalBF.has(deviceId),
        counting: countingBF.has(deviceId),
        scalable: scalableBF.has(deviceId),
        actual: devices.has(deviceId), 
    }
    logPerformance("Checked device", { deviceId, result })
    return result
}

const removeDevice = async (deviceId) => {
    // traditionalBF.remove(deviceId)
    countingBF.remove(deviceId)
    // scalableBF.remove(deviceId)
    devices.delete(deviceId)
    
    logPerformance("Removed device", deviceId)
}

const addMultipleDevices = async (start, end, prefix) => {
    logPerformance('Adding multiple devices', {
        amount: end - start + 1,
        startId: `${prefix}-${start}`,
        endId: `${prefix}-${end}`
    })
    
    const batchSize = 1000
    let promises = []
    for (let i = start; i <= end; i++) {
        const deviceId = `${prefix}-${i}`
        promises.push(addDevice(deviceId))
        
        if (promises.length >= batchSize || i == end) {
            await Promise.all(promises)
            promises = []
        }
    }
}

const getCurrentFalsePositiveRates = async () => {
    const result = {
        traditional: traditionalBF.rate(),
        counting: countingBF.rate(),
        scalable: scalableBF.rate()
    }
    logPerformance("Current False Positive Rates", result)
    return result
}

const getCurrentGraphData = async () => {
    logPerformance('Current Graph Data', graphData)
    return graphData
}

module.exports = {
    addDevice,
    checkDevice,
    removeDevice,
    addMultipleDevices,
    getCurrentFalsePositiveRates,
    getCurrentGraphData,
    resetAll
}
