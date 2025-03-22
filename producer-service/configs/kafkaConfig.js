const TOPIC = {
    HOUSEHOLD_DATA : 'household_topic',
    AREA_DATA: 'area_data',
    ANOMALY_DATA: 'anomaly_data'
}

const TOPIC_CONSUMER = {
    HOUSEHOLD_DATA : 'household_topic_raw',
    AREA_DATA: 'area_data_raw',
    ANOMALY_DATA: 'anomaly_data_raw'
}

const PRODUCER_IDS = {
    [TOPIC.HOUSEHOLD_DATA]: 'household_producer',
    [TOPIC.AREA_DATA]: 'area_producer',
    [TOPIC.ANOMALY_DATA]: 'anomaly_producer',
    DEFAULT: 'default_producer'
}

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID
const BOOTSTRAP_SERVER= process.env.BOOTSTRAP_SERVER
const KAFKA_API_KEY= process.env.KAFKA_API_KEY
const KAFKA_API_SECRET= process.env.KAFKA_API_SECRET
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT
const CONNECTION_TIMEOUT = +process.env.CONNECTION_TIMEOUT
const ALLOW_AUTO_TOPIC_CREATION = +process.env.ALLOW_AUTO_TOPIC_CREATION
const TRANSACTION_TIMEOUT = +process.env.TRANSACTION_TIMEOUT

module.exports = {
    TOPIC,
    TOPIC_CONSUMER,
    PRODUCER_IDS,
    KAFKA_CLIENT_ID,
    BOOTSTRAP_SERVER,
    KAFKA_API_KEY,
    KAFKA_API_SECRET,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    ALLOW_AUTO_TOPIC_CREATION,
    TRANSACTION_TIMEOUT
}