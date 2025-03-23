const { Redis } = require('ioredis')
const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})

const debugTag = 'REDIS'

async function addDevices(devices) {
    if (!Array.isArray(devices) || devices.length === 0) {
        console.warn(`[${debugTag}] addDevices: No devices provided or invalid input.`)
        return
    }
    // Use Redis pipeline for efficient batch operations.
    const pipeline = redisClient.pipeline()

    for (const device of devices) {
        const { deviceId, metadata } = device

        if (!deviceId || typeof metadata !== 'object') {
            console.error(`[${debugTag}] addDevices: Invalid device data. Skipping device:`, device)
            continue
        }

        pipeline.call('BF.ADD', 'bloom:valid_devices', deviceId)
        pipeline.hset(`device:${deviceId}`, metadata)
    }

    try {
        await pipeline.exec()
        console.log(`[${debugTag}] addDevices: Added ${devices.length} devices successfully.`)
    } catch (error) {
        console.error(`[${debugTag}] addDevices: Error adding devices:`, error)
    }
}

async function addDevice(deviceId, metadata) {
    await addDevices([{ deviceId, metadata }])
}

async function checkDevice(deviceId) {
    try {
        // Fast check in Bloom Filter
        const exists = await redisClient.call('BF.EXISTS', 'bloom:valid_devices', deviceId)
        if (!exists) {
            return false
        }
        // Retrieve device metadata from Redis Hash
        const deviceData = await redisClient.hgetall(`device:${deviceId}`)
        if (Object.keys(deviceData).length > 0) {
            return true
        } else {
            console.warn(`[${debugTag}] checkDevice: Device found in Bloom filter but not in hash: ${deviceId}`)
            return false
        }
    } catch (error) {
        console.error(`[${debugTag}] checkDevice: Error checking device:`, error?.message || error)
        throw error
    }
}

async function updateLastSeen(deviceId) {
    try {
        const timestamp = Date.now()
        await redisClient.zadd('devices:last_seen', timestamp, deviceId)
    } catch (error) {
        console.error(`[${debugTag}] updateLastSeen: Error updating last seen for device ${deviceId}:`, error?.message || error)
        throw error
    }
}

module.exports = {
    addDevice,
    addDevices,
    checkDevice,
    updateLastSeen,
}
