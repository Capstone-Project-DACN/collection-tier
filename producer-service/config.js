const TOPIC = {
    HOUSEHOLD_DATA : 'household_data',
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

const kafkaBrokers = process.env.KAFKA_BROKERS
const KAFKA_BROKERS = kafkaBrokers ? kafkaBrokers.split(',') : []
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
    MAX: 70
}
const DISTRIBUTIONS = {
    BELL_CURVE: 'bell_curve',
    UNIFORM: 'uniform',
    LINEAR: 'linear'
}
const RANDOM_ORDER = false

module.exports = {
    TOPIC,
    DATA_TYPE,
    DATA_TYPE_V2,
    KAFKA_CLIENT_ID,
    KAFKA_BROKERS,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    ALLOW_AUTO_TOPIC_CREATION,
    TRANSACTION_TIMEOUT,
    TIME,
    BATCH_SIZE,
    DISTRIBUTIONS,
    RANDOM_ORDER
}