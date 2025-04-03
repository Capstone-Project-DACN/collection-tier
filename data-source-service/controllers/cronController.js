const householdManager = require('../jobs/HouseHoldCronProducerManager')
const { DISTRIBUTIONS } = require('../configs/DistributionConfig')

const cronControlHouseHold = (req, res) => {
    try {
        const { 
            city_id: cityId,
            district_id: districtId,
            distribution_type: distributionType,
            random_order: randomOrder,
            cron_time: cronTime,
            can_start: canStart,
        } = req.query

        if (Number(canStart) === 1) {
            const result = householdManager.start(
                cityId, 
                districtId, 
                distributionType ? distributionType : DISTRIBUTIONS.BELL_CURVE, 
                randomOrder === 'true', 
                cronTime ? cronTime : process.env.DEFAULT_CRON_TIME
            )
            return res.status(result.status).json({ message: result.message, error: result.error })
        } else if (Number(canStart) === 0) {
            const result = householdManager.stop(cityId, districtId)
            return res.status(result.status).json({ message: result.message, error: result.error })
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    cronControlHouseHold
}

