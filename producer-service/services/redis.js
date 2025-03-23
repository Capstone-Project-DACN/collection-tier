const { Redis } = require('ioredis')
const {
    REDIS_HOST,
    REDIS_PORT,
    CUCKOO_FILTER_TAG,
    CUCKOO_FILTER_OPS,
    REDIS_TAG,
    INACTIVE_TIME,
    FALSE_POSITIVE_COUNTER
} = require('../configs/redisConfig')
const timeUtils = require('../utils/timeUtils')

const redisClient = Redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
})

const debugTag = 'REDIS'

async function addDevice(deviceId) {
    if (!deviceId) {
        console.warn(`[${debugTag}] addDevice: Invalid deviceId.`)
        return
    }

    const createdAt = Date.now()
    const pipeline = redisClient.pipeline()

    pipeline.call(CUCKOO_FILTER_OPS.ADD, CUCKOO_FILTER_TAG.VALID_DEVICES, deviceId)
    pipeline.hset(`${REDIS_TAG.DEVICE}:${deviceId}`, 'created_at', createdAt)
    pipeline.zadd(REDIS_TAG.LAST_SEEN, createdAt, deviceId)

    try {
        await pipeline.exec()
        console.log(`[${debugTag}] addDevice: Added device ${deviceId} successfully.`)
    } catch (error) {
        console.error(`[${debugTag}] addDevice: Error adding device:`, error)
        throw error
    }
}

async function addMultipleDevices(start, end, prefix) {
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

async function checkDevice(deviceId) {
    try {
        const exists = await redisClient.call(CUCKOO_FILTER_OPS.EXISTS, CUCKOO_FILTER_TAG.VALID_DEVICES, deviceId)
        if (!exists) return false

        const createdAt = await redisClient.hget(`${REDIS_TAG.DEVICE}:${deviceId}`, 'created_at')
        
        if (createdAt === null) {
            console.warn(`[${debugTag}] checkDevice: False positive detected for device ${deviceId}`)
            await redisClient.incr(FALSE_POSITIVE_COUNTER)
            return false
        }

        return true
    } catch (error) {
        console.error(`[${debugTag}] checkDevice: Error checking device:`, error)
        throw error
    }
}

async function updateLastSeen(deviceId) {
    try {
        const timestamp = Date.now()
        await redisClient.zadd(REDIS_TAG.LAST_SEEN, timestamp, deviceId)
    } catch (error) {
        console.error(`[${debugTag}] updateLastSeen: Error updating last seen for device ${deviceId}:`, error?.message || error)
        throw error
    }
}

async function getInactiveDevices(pageNumber = 1, pageSize = 10, dateTime = false, threshold = INACTIVE_TIME) {
    try {
        pageNumber = Math.max(1, parseInt(pageNumber))
        pageSize = Math.max(1, parseInt(pageSize))

        const offset = (pageNumber - 1) * pageSize
        const cutoffTime = Date.now() - threshold

        // Get a paginated list of inactive devices
        const rawResults = await redisClient.zrangebyscore(
            REDIS_TAG.LAST_SEEN,
            '-inf',
            cutoffTime,
            'WITHSCORES',
            'LIMIT',
            offset,
            pageSize
        )

        // Process the raw results into structured data
        const inactiveDevices = []
        for (let i = 0; i < rawResults.length; i += 2) {
            inactiveDevices.push({
                deviceId: rawResults[i],
                lastSeen: dateTime? timeUtils.msToDateTime(Number(rawResults[i + 1])) : Number(rawResults[i + 1])
            })
        }

        // Get total inactive device count
        const totalCount = await redisClient.zcount(REDIS_TAG.LAST_SEEN, '-inf', cutoffTime)

        return {
            inactive_thresold: dateTime? timeUtils.formatDuration(threshold) : `${threshold} miliseconds`,
            inactiveDevices,
            pageNumber,
            pageSize,
            total: totalCount,
            totalPages: Math.ceil(totalCount / pageSize)
        }
    } catch (error) {
        console.error(`[${debugTag}] getInactiveDevices error:`, error)
        throw error
    }
}


async function removeDevice(deviceId) {
    try {
        const pipeline = redisClient.pipeline()

        pipeline.call(CUCKOO_FILTER_OPS.DEL, CUCKOO_FILTER_TAG.VALID_DEVICES, deviceId)
        pipeline.del(`${REDIS_TAG.DEVICE}:${deviceId}`)
        pipeline.zrem(REDIS_TAG.LAST_SEEN, deviceId)

        await pipeline.exec()
        console.log(`[${debugTag}] removeDevice: Removed device ${deviceId} successfully.`)
    } catch (error) {
        console.error(`[${debugTag}] removeDevice: Error removing device:`, error)
        throw error
    }
}

module.exports = {
    addDevice,
    addMultipleDevices,
    checkDevice,
    updateLastSeen,
    getInactiveDevices,
    removeDevice
}
