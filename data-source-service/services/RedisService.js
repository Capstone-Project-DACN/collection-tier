const { Redis } = require('ioredis')
const { REDIS_HOST, REDIS_PORT, REDIS_TAG } = require('../configs/RedisConfig')

const redisClient = Redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
})

async function getTotalElectricityUsage(deviceId) {
    try {
        const deviceKey = `${REDIS_TAG.DEVICE}:${deviceId}`
        const exists = await redisClient.exists(deviceKey)

        if (!exists) {
            return null
        }

        const detail = await redisClient.hgetall(deviceKey)

        return detail?.total_electricity_usage_kwh
    } catch (error) {
        return null
    }
}

async function getElectricityUsage(deviceId) {
    try {
        const deviceKey = `${REDIS_TAG.DEVICE}:${deviceId}`
        const exists = await redisClient.exists(deviceKey)

        if (!exists) {
            return null
        }

        const detail = await redisClient.hgetall(deviceKey)

        return detail?.electricity_usage_kwh
    } catch (error) {
        return null
    }
}

module.exports = {
    getTotalElectricityUsage,
    getElectricityUsage
}