const TOPIC = {
    HOUSEHOLD_DATA : 'household_topic',
    AREA_DATA: 'area_data',
    ANOMALY_DATA: 'anomaly_data'
}

const DATA_TYPE = {
    household: 'HouseholdData',
    area: 'AreaData',
    anomaly: 'AnomalyData'
}

const DATA_TYPE_V2 = {
    household: 'household',
    area: 'area',
    anomaly: 'anomaly'
}

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID
const BOOTSTRAP_SERVER= process.env.BOOTSTRAP_SERVER
const KAFKA_API_KEY= process.env.KAFKA_API_KEY
const KAFKA_API_SECRET= process.env.KAFKA_API_SECRET
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT
const CONNECTION_TIMEOUT = +process.env.CONNECTION_TIMEOUT
const ALLOW_AUTO_TOPIC_CREATION = +process.env.ALLOW_AUTO_TOPIC_CREATION
const TRANSACTION_TIMEOUT = +process.env.TRANSACTION_TIMEOUT

const TIME = {
    TOTAL_DURATION: 200,
    INTERVAL: 2,
}

TIME.TOTAL_SLOTS = TIME.TOTAL_DURATION / TIME.INTERVAL

const BATCH_SIZE = {
    MEAN: 30,
    STD_DEV: 15,
    MIN: 1,
    MAX: 70,
    MEAN1: 32,
    NUM_MODES: 3,
    LAMBDA: 0.05
}
const DISTRIBUTIONS = {
    BELL_CURVE: 'Bell Curve',
    UNIFORM: 'Uniform',
    LINEAR: 'Linear',
    BIMODAL: 'Bimodal',
    MULTIMODAL: 'Multimodal',
    EXPONENTIAL: 'Exponential'
}
const RANDOM_ORDER = false

module.exports = {
    TOPIC,
    DATA_TYPE,
    DATA_TYPE_V2,
    KAFKA_CLIENT_ID,
    BOOTSTRAP_SERVER,
    KAFKA_API_KEY,
    KAFKA_API_SECRET,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    ALLOW_AUTO_TOPIC_CREATION,
    TRANSACTION_TIMEOUT,
    TIME,
    BATCH_SIZE,
    DISTRIBUTIONS,
    RANDOM_ORDER
}