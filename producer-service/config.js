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

const TIME_GAUSSIAN = {
    TOTAL_DURATION: 200,
    INTERVAL: 2,
}

TIME_GAUSSIAN.TOTAL_SLOTS = TIME_GAUSSIAN.TOTAL_DURATION / TIME_GAUSSIAN.INTERVAL

const BATCH_SIZE_GAUSSIAN = {
    MEAN: 35,
    STD_DEV: 5,
    MIN: 1,
    MAX: 70
}

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
    TIME_GAUSSIAN,
    BATCH_SIZE_GAUSSIAN
}