const HouseholdCronProducer = require('./concretes/HouseholdCronProducer')

class HouseholdCronProducerManager {
    constructor() {
        this.jobs = new Map()
    }

    start(cityId, districtId, distributionType, randomOrder, cronTime) {
        const key = `${cityId}-${districtId}`
        if (this.jobs.has(key)) {
            console.log(`[HouseholdCronManager] Cron already running for ${key}`)
            return {
                status: 400,
                error: `Cron already running for ${key}`
            }
        }

        const producer = new HouseholdCronProducer(cityId, districtId, distributionType, randomOrder, cronTime, true)
        producer.start()
        this.jobs.set(key, producer)

        console.log(`[HouseholdCronManager] Started cron for ${key}`)
        return {
            status: 200,
            message: `Started cron for ${key}`
        }
    }

    stop(cityId, districtId) {
        const key = `${cityId}-${districtId}`
        const producer = this.jobs.get(key)
        if (!producer) {
            console.log(`[HouseholdCronManager] No active cron found for ${key}`)
            return {
                status: 400,
                error: `No active cron found for ${key}`
            }
        }

        producer.stop()
        this.jobs.delete(key)
        console.log(`[HouseholdCronManager] Stopped cron for ${key}`)

        return {
            status: 200,
            message: `Stopped cron for ${key}`
        }
    }
}

module.exports = new HouseholdCronProducerManager()
