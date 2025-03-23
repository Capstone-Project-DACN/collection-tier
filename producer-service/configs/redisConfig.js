const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT  = process.env.REDIS_PORT

const BLOOM_FILTER_TAG = {
    VALID_DEVICES: 'bloom:valid_devices'
}

const BLOOM_FILTER_OPS = {
    ADD: 'BF.ADD',
    EXISTS: 'BF.EXISTS'
}

const REDIS_TAG = {
    DEVICE: 'device'
}