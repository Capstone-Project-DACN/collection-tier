const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT  = process.env.REDIS_PORT

const CUCKOO_FILTER_TAG = {
    VALID_DEVICES: 'bloom:valid_devices'
}

const CUCKOO_FILTER_OPS = {
    ADD: 'CF.ADD',
    EXISTS: 'CF.EXISTS',
    DEL: 'CF.DEL'
}

const REDIS_TAG = {
    DEVICE: 'device',
    LAST_SEEN: 'devices:last_seen'
}

const INACTIVE_TIME = +process.env.INACTIVE_TIME || 60 * 60 * 1000 // 1 hour
const FALSE_POSITIVE_COUNTER = 'false_positive_counter'

module.exports = {
    REDIS_HOST,
    REDIS_PORT,
    CUCKOO_FILTER_TAG,
    CUCKOO_FILTER_OPS,
    REDIS_TAG,
    INACTIVE_TIME,
    FALSE_POSITIVE_COUNTER
}
