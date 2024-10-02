const { generateRandomHouseholdData } = require('../helpers/household')
const { generateRandomAreaData } = require('../helpers/area')
const { generateRandomAnomalyData } = require('../helpers/anomaly')

const randomDataGenerator = () => {
    const dataGenerators = [
        generateRandomHouseholdData,
        generateRandomAreaData,
        generateRandomAnomalyData
    ]

    const randomIndex = Math.floor(Math.random() * dataGenerators.length)

    return dataGenerators[randomIndex]()
}

const createData = async (req, res) => {
    const data = await randomDataGenerator()
    console.log(`Generated Random Data ${data?.type}:`, data)

    return res.status(200).json(data)
}

module.exports = {
    createData
}
