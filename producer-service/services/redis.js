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

        const isExist = await redisClient.exists(`${REDIS_TAG.DEVICE}:${deviceId}`)
        
        if (!isExist) {
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

async function updateLastSeen(deviceId, metadata = {}) {
    try {
        const timestamp = Date.now();
        const pipeline = redisClient.pipeline();

        pipeline.zadd(REDIS_TAG.LAST_SEEN, timestamp, deviceId)

        if (Object.keys(metadata).length > 0) {
            metadata.last_seen = timestamp
            pipeline.hset(`${REDIS_TAG.DEVICE}:${deviceId}`, ...Object.entries(metadata).flat())
        }

        await pipeline.exec()
    } catch (error) {
        console.error(`[${debugTag}] updateLastSeen: Error updating last seen for device ${deviceId}:`, error)
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

async function getFalsePositiveCount() {
    try {
        const count = await redisClient.get(FALSE_POSITIVE_COUNTER)
        return Number(count) || 0
    } catch (error) {
        console.error(`[${debugTag}] getFalsePositiveCount: Error getting false positive count:`, error)
        throw error
    }
}

async function getDeviceDetail(deviceId) {
    try {
        const deviceKey = `${REDIS_TAG.DEVICE}:${deviceId}`
        const exists = await redisClient.exists(deviceKey)

        if (!exists) {
            return null
        }

        const detail = await redisClient.hgetall(deviceKey)
        enhanceData(detail)

        return detail
    } catch (error) {
        console.error(`[${debugTag}] getDeviceDetail: Error getting device detail for ${deviceId}:`, error)
        throw error
    }
}

async function updateTotalElectricityUsage(deviceId, electricityUsage) {
    try {
        await redisClient.hincrbyfloat(`${REDIS_TAG.DEVICE}:${deviceId}`, 'total_electricity_usage_kwh', electricityUsage)
    } catch (error) {
        console.error(`[${debugTag}] updateTotalElectricityUsage: Error updating total electricity usage for device ${deviceId}:`, error)
        throw error
    }
}

async function getDevicesByTopic(topic) {
    try {
        if (!topic.includes('_')) return []

        const prefixId = topic.replaceAll('_', '-')
        let cursor = '0'
        const limit = 100
        const results = []

        do {
            const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', `${REDIS_TAG.DEVICE}:${prefixId}*`, 'COUNT', limit)
            cursor = nextCursor

            Promise.all(keys.map(async (key) => {
                const deviceId = key.replace(`${REDIS_TAG.DEVICE}:`, '')
                const detail = await redisClient.hgetall(key)
                enhanceData(detail)
                
                results.push({ device_id: deviceId, value: detail })
            }))

        } while (cursor !== '0')

        return results

    } catch (error) {
        console.error(`[${debugTag}] getDevicesByTopic: Error getting devices by topic ${topic}:`, error)
        throw error
    }
}

async function countDevicesByTopic(topic) {
    try {
        if (!topic.includes('_')) return 0

        const prefixId = topic.replaceAll('_', '-')
        let cursor = '0'
        const limit = 100
        let count = 0

        do {
            const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', `${REDIS_TAG.DEVICE}:${prefixId}*`, 'COUNT', limit)
            cursor = nextCursor
            count += keys.length

        } while (cursor !== '0')

        return count
    } catch (error) {
        console.error(`[${debugTag}] countDevicesByTopic: Error counting devices by topic ${topic}:`, error)
        throw error
    }
}

async function enhanceData(data) {
    data.electricity_usage_kwh = data.total_electricity_usage_kwh || data.electricity_usage_kwh || "0"
    data.voltage = data.voltage || "N/A"
    data.current = data.current || "N/A"
    data.increased_electricity_usage_kwh = data.increased_electricity_usage_kwh || "N/A"
    data.last_seen = data.last_seen || "N/A"
}

module.exports = {
    addDevice,
    addMultipleDevices,
    checkDevice,
    updateLastSeen,
    getInactiveDevices,
    removeDevice,
    getFalsePositiveCount,
    getDeviceDetail,
    updateTotalElectricityUsage,
    getDevicesByTopic,
    countDevicesByTopic
}
