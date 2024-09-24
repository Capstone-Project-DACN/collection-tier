const { generateGPSData } = require('../helpers/gpsData')

const createData = async (req, res) => {
    const gpsData = await generateGPSData()
    console.log('Generated GPS Data:', gpsData)

    return res.status(200).json(gpsData)
}

module.exports = {
    createData
}