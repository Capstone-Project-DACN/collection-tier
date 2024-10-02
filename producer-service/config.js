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

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID

const kafkaBrokers = process.env.KAFKA_BROKERS
const KAFKA_BROKERS = kafkaBrokers ? kafkaBrokers.split(',') : []

module.exports = {
    TOPIC,
    DATA_TYPE,
    KAFKA_CLIENT_ID,
    KAFKA_BROKERS
}