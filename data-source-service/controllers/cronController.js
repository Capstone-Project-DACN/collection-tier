const cronProducerManager = require('../jobs/CronProducerManager')
const { DISTRIBUTIONS } = require('../configs/DistributionConfig')
const { DATA_TYPE, ALLOWED_LOCATIONS} = require('../configs/DataConfig')

const updateCronInfo = (req, res) => {
    try {
        const { 
            cron_type: cronType,
            city_id: cityId,
            district_id: districtId,
            distribution_type: distributionType,
            random_order: randomOrder,
            cron_time: cronTime
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

        const result = cronProducerManager.update(
            cronType, 
            cityId, 
            districtId, 
            distributionType ? distributionType : DISTRIBUTIONS.BELL_CURVE, 
            randomOrder === 'true',
            cronTime ? convertIntervalToCron(cronTime) : process.env.DEFAULT_CRON_TIME
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

/**
 * HELPER FUNCTIONS, CLASSES
 * commonValidation
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
        return res.status(400).json({ error: 'Missing cron_type' })
    }

    if (!cityId || !districtId) {
        return res.status(400).json({ error: 'Missing city_id or district_id' })
    }

    const city = ALLOWED_LOCATIONS.find(city => city.city_id === cityId)
    if (!city) {
        return res.status(400).json({ error: 'Invalid city_id' })
    }

    const district = city.districts.find(district => district.district_id === districtId)
    if (!district) {
        return res.status(400).json({ error: 'Invalid district_id' })
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
    getJobDetail
}

