const { generateRandomHouseholdData } = require('../helpers/household')
const { generateRandomAreaData } = require('../helpers/area')
const { generateRandomAnomalyData } = require('../helpers/anomaly')
const { DATA_TYPE } = require('../helpers/config')

const randomDataGenerator = () => {
    const dataGenerators = [
        generateRandomHouseholdData,
        generateRandomAreaData,
        generateRandomAnomalyData
    ]
    const randomIndex = Math.floor(Math.random() * dataGenerators.length)
    return dataGenerators[randomIndex]()
}

const groupedData = (batchResult) => {
    const groupedData = batchResult.reduce((acc, data) => {
        const type = data.type || 'Unknown'
        if (!acc[type]) {
            acc[type] = []
        }
        acc[type].push(data)
        return acc
    }, {})

    return groupedData
}

const createData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(randomDataGenerator())
    }
    const batchResult = await Promise.all(batchData)
    console.log('Generated Random Data:', batchResult.length)

    const groupedBatchResult = groupedData(batchResult)
    console.log(groupedBatchResult)
    return res.status(200).json(groupedBatchResult)
}

const createHouseholdData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomHouseholdData())
    }
    const batchResult = await Promise.all(batchData)
    console.log('Generated Household Data:', batchResult.length)

    const groupedBatchResult = {
        [DATA_TYPE.household]: batchResult 
    }
    console.log(groupedBatchResult)
    return res.status(200).json(groupedBatchResult)
}

const createAreaData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAreaData())
    }
    const batchResult = await Promise.all(batchData)
    console.log('Generated Area Data:', batchResult.length)

    const groupedBatchResult = {
        [DATA_TYPE.area]: batchResult 
    }
    console.log(groupedBatchResult)
    return res.status(200).json(groupedBatchResult)
}

const createAnomalyData = async (req, res) => {
    const batchSize = Number(req.query.batch_size) || 1
    const batchData = []
    for (let i = 0; i < batchSize; i++) {
        batchData.push(generateRandomAnomalyData())
    }
    const batchResult = await Promise.all(batchData)
    console.log('Generated Anomaly Data:', batchResult.length)

    const groupedBatchResult = {
        [DATA_TYPE.anomaly]: batchResult 
    }
    console.log(groupedBatchResult)
    return res.status(200).json(groupedBatchResult)
}

module.exports = {
    createData,
    createHouseholdData,
    createAreaData,
    createAnomalyData
}
