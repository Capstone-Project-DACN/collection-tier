const HouseholdCronProducer = require('./concretes/HouseHoldCronProducer')
const AreaCronProducer = require('./concretes/AreaCronProducer')
const AnomalyCronProducer = require('./concretes/AnomalyCronProducer')
const { DATA_TYPE, ALLOWED_LOCATIONS } = require('../configs/DataConfig')
const { DISTRIBUTIONS } = require('../configs/DistributionConfig')

const TAG = 'CronProducerManager'

class CronProducerManager {
    constructor() {
        this.jobs = new Map()

        Object.values(DATA_TYPE).forEach(cronType => {
            ALLOWED_LOCATIONS.forEach(city => {
                city.districts.forEach(district => {
                    const cityId = city.city_id
                    const districtId = district.district_id
                    const key = `${cronType}-${city.city_id}-${district.district_id}`

                    const distributionType = DISTRIBUTIONS.BELL_CURVE
                    const randomOrder = false
                    const cronTime = process.env.DEFAULT_CRON_TIME

                    let producer = null
                    switch (cronType) {
                        case DATA_TYPE.household:
                            producer = new HouseholdCronProducer(cityId, districtId, distributionType, randomOrder, cronTime)
                            break
                        case DATA_TYPE.area:
                            producer = new AreaCronProducer(cityId, districtId, distributionType, randomOrder, cronTime)
                            break
                        case DATA_TYPE.anomaly:
                            producer = new AnomalyCronProducer(cityId, districtId, distributionType, randomOrder, cronTime)
                            break
                        default:
                            console.error(`[${TAG}] Init job failed. Invalid job type: ${cronType}`)
                    }

                    this.jobs.set(key, producer)
                    console.info(`[${TAG}] Init job for ${key}`)
                })
            })
        })

        console.info(`[${TAG}] Init ${this.jobs.size} jobs`)
    }

    update(cronType, cityId, districtId, distributionType, randomOrder, cronTime) {
        const key = `${cronType}-${cityId}-${districtId}`
        let producer = this.jobs.get(key)

        if (!producer) {
            console.error(`[${TAG}] No active job found for ${key}`)
            return {
                status: 404,
                error: `No active job found for ${key}`
            }
        }

        if (producer.isRunning === true) {
            console.error(`[${TAG}] Job already running for ${key}. Stop before updating job.`)
            return {
                status: 400,
                error: `Job already running for ${key}. Stop before updating job.`
            }
        }

        switch (cronType) {
            case DATA_TYPE.household:
                producer = new HouseholdCronProducer(cityId, districtId, distributionType, randomOrder, cronTime)
                break
            case DATA_TYPE.area:
                producer = new AreaCronProducer(cityId, districtId, distributionType, randomOrder, cronTime)
                break
            case DATA_TYPE.anomaly:
                producer = new AnomalyCronProducer(cityId, districtId, distributionType, randomOrder, cronTime)
                break
            default:
                console.error(`[${TAG}] Invalid cron type: ${cronType}`)
                return {
                    status: 400,
                    error: `Invalid cron type: ${cronType}`
                }
        }

        this.jobs.set(key, producer)

        console.info(`[${TAG}] Updated job for ${key}`)
        
        return {
            status: 200,
            message: `Updated job for ${key}`
        }
    }

    start(cronType, cityId, districtId) {
        const key = `${cronType}-${cityId}-${districtId}`
        const producer = this.jobs.get(key)
        if (!producer) {
            console.error(`[${TAG}] No active job found for ${key}`)
            return {
                status: 404,
                error: `No active job found for ${key}`
            }
        }

        if (producer.isRunning === true) {
            console.error(`[${TAG}] Job already running for ${key}`)
            return {
                status: 400,
                error: `Job already running for ${key}`
            }
        }

        producer.start()

        console.info(`[${TAG}] Started job for ${key}`)

        return {
            status: 200,
            message: `Started job for ${key}`
        }
    }

    stop(cronType, cityId, districtId) {
        const key = `${cronType}-${cityId}-${districtId}`
        const producer = this.jobs.get(key)
        if (!producer) {
            console.error(`[${TAG}] No active job found for ${key}`)
            return {
                status: 404,
                error: `No active job found for ${key}`
            }
        }

        if (producer.isRunning === false) {
            console.error(`[${TAG}] Job already stopped for ${key}`)
            return {
                status: 400,
                error: `Job already stopped for ${key}`
            }
        }

        producer.stop()
        // this.jobs.delete(key)

        console.info(`[${TAG}] Stopped job for ${key}`)

        return {
            status: 200,
            message: `Stopped job for ${key}`
        }
    }

    getJobs() {
        const jobs = []
        this.jobs.forEach((producer, key) => {
            jobs.push({
                cron_type: producer.cronType,
                city_id: producer.cityId,
                district_id: producer.districtId,
                status: producer.isRunning ? 'running' : 'stopped'
            })
        })

        return {
            status: 200,
            data: jobs,
            total: jobs.length
        }
    }

    getJobDetail(cronType, cityId, districtId) {
        const key = `${cronType}-${cityId}-${districtId}`
        const producer = this.jobs.get(key)
        if (!producer) {
            console.error(`[${TAG}] No active cron found for ${key}`)
            return {
                status: 404,
                error: `No active cron found for ${key}`
            }
        }

        return {
            status: 200,
            data: {
                cron_type: producer.cronType,
                city_id: producer.cityId,
                district_id: producer.districtId,
                distribution_type: producer.distributionType,
                random_order: producer.randomOrder === true ? 'true' : 'false',
                cron_time: producer.job.cronTime.source.toString(),
                status: producer.isRunning ? 'running' : 'stopped'
            }
        }
    }

    getAvailableDistributionType() {

        const distributionTypeList = Object.values(DISTRIBUTIONS)

        return {
            status: 200,
            data: distributionTypeList,
            total: distributionTypeList.length
        }
    }

    getChartInfo(cronType, cityId, districtId) {
        const key = `${cronType}-${cityId}-${districtId}`
        const producer = this.jobs.get(key)
        if (!producer) {
            console.error(`[${TAG}] No active cron found for ${key}`)
            return {
                status: 404,
                error: `No active cron found for ${key}`
            }
        }

        return {
            status: 200,
            data: {
                chart_title: producer.distributionType,
                chart_data: producer.batchManager.getChartData()
            }
        }
    }
}

module.exports = new CronProducerManager()
