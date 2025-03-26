const TOPIC = {
    // DEFAULT TOPIC
    HOUSEHOLD : 'household_raw',
    AREA: 'area_raw',
    ANOMALY: 'anomaly_raw',

    // HOUSEHOLD
    HOUSEHOLD_HCMC_Q1: 'household_HCMC_Q1_raw',
    HOUSEHOLD_HCMC_Q3: 'household_HCMC_Q3_raw',
    HOUSEHOLD_HCMC_Q4: 'household_HCMC_Q4_raw',
    HOUSEHOLD_HCMC_Q5: 'household_HCMC_Q5_raw',
    HOUSEHOLD_HCMC_Q6: 'household_HCMC_Q6_raw',
    HOUSEHOLD_HCMC_Q7: 'household_HCMC_Q7_raw',
    HOUSEHOLD_HCMC_Q8: 'household_HCMC_Q8_raw',
    HOUSEHOLD_HCMC_Q10: 'household_HCMC_Q10_raw',
    HOUSEHOLD_HCMC_Q11: 'household_HCMC_Q11_raw',
    HOUSEHOLD_HCMC_Q12: 'household_HCMC_Q12_raw',
    HOUSEHOLD_HCMC_QGV: 'household_HCMC_QGV_raw',
    HOUSEHOLD_HCMC_QTB: 'household_HCMC_QTB_raw',
    HOUSEHOLD_HCMC_QBTHANH: 'household_HCMC_QBTHANH_raw',
    HOUSEHOLD_HCMC_QTP: 'household_HCMC_QTP_raw',
    HOUSEHOLD_HCMC_QPN: 'household_HCMC_QPN_raw',

    HOUSEHOLD_TDUC_Q2: 'household_TDUC_Q2_raw',
    HOUSEHOLD_TDUC_Q9: 'household_TDUC_Q9',

    // AREA
    AREA_HCMC_Q1: 'area_HCMC_Q1_raw',
    AREA_HCMC_Q3: 'area_HCMC_Q3_raw',
    AREA_HCMC_Q4: 'area_HCMC_Q4_raw',
    AREA_HCMC_Q5: 'area_HCMC_Q5_raw',
    AREA_HCMC_Q6: 'area_HCMC_Q6_raw',
    AREA_HCMC_Q7: 'area_HCMC_Q7_raw',
    AREA_HCMC_Q8: 'area_HCMC_Q8_raw',
    AREA_HCMC_Q10: 'area_HCMC_Q10_raw',
    AREA_HCMC_Q11: 'area_HCMC_Q11_raw',
    AREA_HCMC_Q12: 'area_HCMC_Q12_raw',
    AREA_HCMC_QGV: 'area_HCMC_QGV_raw',
    AREA_HCMC_QTB: 'area_HCMC_QTB_raw',
    AREA_HCMC_QBTHANH: 'area_HCMC_QBTHANH_raw',
    AREA_HCMC_QTP: 'area_HCMC_QTP_raw',
    AREA_HCMC_QPN: 'area_HCMC_QPN_raw',

    AREA_TDUC_Q2: 'area_TDUC_Q2_raw',
    AREA_TDUC_Q9: 'area_TDUC_Q9'
}

const PRODUCER_IDS = {
    [TOPIC.HOUSEHOLD]: 'household_producer',
    [TOPIC.AREA]: 'area_producer',
    [TOPIC.ANOMALY]: 'anomaly_producer',
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
