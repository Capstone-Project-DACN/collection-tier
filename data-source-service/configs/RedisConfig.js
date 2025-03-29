const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT  = process.env.REDIS_PORT

const REDIS_TAG = {
    DEVICE: 'device',
    LAST_SEEN: 'devices:last_seen'
}

module.exports = {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_TAG
}
