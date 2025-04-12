const cronProducerManager = require('../jobs/CronProducerManager')
const { DISTRIBUTIONS } = require('../configs/DistributionConfig')
const { DATA_TYPE, ALLOWED_LOCATIONS, ALLOWED_DEVICE_ID } = require('../configs/DataConfig')
const DeviceIdGenerator = require('../services/DeviceIdGenerator')

const updateCronInfo = (req, res) => {
    try {
        const { 
            cron_type: cronType,
            city_id: cityId,
            district_id: districtId,
            distribution_type: distributionType,
            random_order: randomOrder,
            cron_time: cronTime,
            start_id: startId,
            end_id: endId
        } = req.query

        useCommonValidation(req, res)

        if (!distributionType && !randomOrder && !cronTime) {
            return res.status(200).json({ message: 'No changes made' })
        }
        
        if (distributionType && !Object.values(DISTRIBUTIONS).includes(distributionType)) {
            return res.status(400).json({ error: `Invalid distribution_type. Available types: ${Object.values(DISTRIBUTIONS).join(', ')}` })
        }

        if (randomOrder && randomOrder !== 'true' && randomOrder !== 'false') {
            return res.status(400).json({ error: 'Invalid random_order. Must be true or false' })
        }

        if (cronTime && !isValidIntervalFormat(cronTime)) {
            return res.status(400).json({ error: 'Invalid cron_time format. Use something like 5s, 10m, or 1h' })
        }

        useDeviceIdValidation(startId, endId)

        const result = cronProducerManager.update(
            cronType, 
            cityId, 
            districtId, 
            distributionType ? distributionType : DISTRIBUTIONS.BELL_CURVE, 
            randomOrder === 'true',
            cronTime ? convertIntervalToCron(cronTime) : process.env.DEFAULT_CRON_TIME,
            startId && endId ? Number(startId) : ALLOWED_DEVICE_ID.START,
            startId && endId ? Number(endId) : ALLOWED_DEVICE_ID.END
        )
        return res.status(result.status).json({ message: result.message, error: result.error })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.customMessage || 'Internal Server Error' })
    }
}

const triggerCronStatus = (req, res) => {
    try {
        const { 
            cron_type: cronType,
            city_id: cityId,
            district_id: districtId,
            enable
        } = req.query

        useCommonValidation(req, res)

        if (!enable) {
            return res.status(400).json({ error: 'Missing enable command' })
        }

        if (enable === 'true') {
            const result = cronProducerManager.start(cronType, cityId, districtId)
            return res.status(result.status).json({ message: result.message, error: result.error })
        } else if (enable === 'false') {
            const result = cronProducerManager.stop(cronType, cityId, districtId)
            return res.status(result.status).json({ message: result.message, error: result.error })
        }

        return res.status(400).json({ error: 'Invalid enable command. Command value must be true or false' })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.customMessage || 'Internal Server Error' })
    }
}

const getJobs = (req, res) => {
    try {

        const result = cronProducerManager.getJobs()

        return res.status(result.status).json({ total: result.total, data: result.data })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.customMessage || 'Internal Server Error' })
    }
}

const getJobDetail = (req, res) => {
    try {
        const { 
            cron_type: cronType,
            city_id: cityId,
            district_id: districtId
        } = req.query

        useCommonValidation(req, res)
        
        const result = cronProducerManager.getJobDetail(cronType, cityId, districtId)

        return res.status(result.status).json({ 
            data: result.data,
            error: result.error
        })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.customMessage || 'Internal Server Error' })
    }
}

const getAvailableDistributionType = (req, res) => {
    try {
        const result = cronProducerManager.getAvailableDistributionType()

        return res.status(result.status).json({ total: result.total, data: result.data })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.customMessage || 'Internal Server Error' })
    }
}

const getChartInfo = (req, res) => {
    try {
        const { 
            cron_type: cronType,
            city_id: cityId,
            district_id: districtId
        } = req.query

        useCommonValidation(req, res)

        const result = cronProducerManager.getChartInfo(cronType, cityId, districtId)

        return res.status(result.status).json({ 
            data: result.data,
            error: result.error
        })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.customMessage || 'Internal Server Error' })
    }
}

/**
 * HELPER FUNCTIONS, CLASSES
 * useCommonValidation
 * useDeviceIdValidation
 * convertIntervalToCron
 * isValidIntervalFormat
 * CustomError extends Error
 */

function useCommonValidation(req, res) {
    const { 
        cron_type: cronType,
        city_id: cityId,
        district_id: districtId
    } = req.query

    if (!cronType || !Object.values(DATA_TYPE).includes(cronType)) {
        throw new CustomError('Missing cron_type' , 400)
    }

    if (!cityId || !districtId) {
        throw new CustomError('Missing city_id or district_id', 400)
    }

    const city = ALLOWED_LOCATIONS.find(city => city.city_id === cityId)
    if (!city) {
        throw new CustomError('Invalid city_id', 400)
    }

    const district = city.districts.find(district => district.district_id === districtId)
    if (!district) {
        throw new CustomError('Invalid district_id', 400)
    }
}

function useDeviceIdValidation(startId, endId) {
    if (startId && !endId) {
        throw new CustomError('Having start_id but not end_id' , 400)
    }

    if (!startId && endId) {
        throw new CustomError('Having end_id but not start_id' , 400)
    }

    if (startId && !DeviceIdGenerator.isIdValid(startId)) {
        throw new CustomError(`Invalid start_id. start_id must in range ${ALLOWED_DEVICE_ID.START}-${ALLOWED_DEVICE_ID.END}` , 400)
    }

    if (endId && !DeviceIdGenerator.isIdValid(endId)) {
        throw new CustomError(`Invalid end_id. end_id must in range ${ALLOWED_DEVICE_ID.START}-${ALLOWED_DEVICE_ID.END}` , 400)
    }

    if (startId && endId && Number(startId) > Number(endId)) {
        throw new CustomError('Invalid start_id and end_id. start_id must be smaller than or equal to end_id' , 400)
    }
}

function convertIntervalToCron(input) {
    const match = input.match(/^(\d+)([smh])$/)

    if (!match) {
        throw new CustomError('Invalid format. Use something like 5s, 10m, or 1h', 400)
    }

    const value = parseInt(match[1])
    const unit = match[2]

    if (unit === 's' && (value < 1 || value > 59)) {
        throw new CustomError('Seconds must be between 1 and 59', 400)
    }
    if (unit === 'm' && (value < 1 || value > 59)) {
        throw new CustomError('Minutes must be between 1 and 59', 400)
    }
    if (unit === 'h' && (value < 1 || value > 23)) {
        throw new CustomError('Hours must be between 1 and 23', 400)
    }

    switch (unit) {
        case 's': return `*/${value} * * * * *`    // every X seconds
        case 'm': return `0 */${value} * * * *`    // every X minutes
        case 'h': return `0 0 */${value} * * *`    // every X hours
    }
}

function isValidIntervalFormat(input) {
    return input.match(/^(\d+)([smh])$/)
}

class CustomError extends Error {
    constructor(message, status) {
        super(message)
        this.status = Number(status) || 500
        this.customMessage = message || 'Internal Server Error'
    }  
}

module.exports = {
    updateCronInfo,
    triggerCronStatus,
    getJobs,
    getJobDetail,
    getAvailableDistributionType,
    getChartInfo
}

