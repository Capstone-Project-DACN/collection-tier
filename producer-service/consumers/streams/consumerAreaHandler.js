const BaseConsumer = require('../BaseConsumer')
const uuidv4 = require('uuid').v4
const { 
    KAFKA_CLIENT_ID,
    TOPIC_CONSUMER,
    TOPIC_PRODUCER,
    CONSUMER_GROUP_IDS,
    BOOTSTRAP_SERVER,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    KAFKA_API_KEY,
    KAFKA_API_SECRET,
    ALLOW_AUTO_TOPIC_CREATION
} = require('../../configs/kafkaConfig')
const dataTransferService = require('../../services/DataTransferService')
const CONSUMER_AREA_ENABLED = +process.env.CONSUMER_AREA_ENABLED

class ConsumerAreaHandler extends BaseConsumer {
    constructor(config) {
        const defaultConfig = {
            clientId: `${KAFKA_CLIENT_ID}-${uuidv4()}`,
            groupId: `${KAFKA_CLIENT_ID}-${CONSUMER_GROUP_IDS.AREA}`,
            topics: [
                TOPIC_CONSUMER.AREA,
                
                TOPIC_CONSUMER.AREA_HCMC_Q1,
                TOPIC_CONSUMER.AREA_HCMC_Q3,
                TOPIC_CONSUMER.AREA_HCMC_Q4,
                TOPIC_CONSUMER.AREA_HCMC_Q5,
                TOPIC_CONSUMER.AREA_HCMC_Q6,
                TOPIC_CONSUMER.AREA_HCMC_Q7,
                TOPIC_CONSUMER.AREA_HCMC_Q8,
                TOPIC_CONSUMER.AREA_HCMC_Q10,
                TOPIC_CONSUMER.AREA_HCMC_Q11,
                TOPIC_CONSUMER.AREA_HCMC_Q12,
                TOPIC_CONSUMER.AREA_HCMC_QGV,
                TOPIC_CONSUMER.AREA_HCMC_QTB,
                TOPIC_CONSUMER.AREA_HCMC_QBTHANH,
                TOPIC_CONSUMER.AREA_HCMC_QTP,
                TOPIC_CONSUMER.AREA_HCMC_QPN,
                
                TOPIC_CONSUMER.AREA_TDUC_Q2,
                TOPIC_CONSUMER.AREA_TDUC_Q9
            ],
            brokers: [BOOTSTRAP_SERVER],
            kafkaConfig: {
                
                // sasl: {
                //     mechanism: 'plain',
                //     username: KAFKA_API_KEY,
                //     password: KAFKA_API_SECRET
                // },
                // ssl: true,
                requestTimeout: REQUEST_TIMEOUT,
                connectionTimeout: CONNECTION_TIMEOUT,
                allowAutoTopicCreation: ALLOW_AUTO_TOPIC_CREATION === 1
            },
            debug: false,
            ...config,
        }
        super(defaultConfig)
    }

    async handleMessage({ topic, partition, message }) {
        try {
            const messageValue = message.value.toString()
            this.logger.info(`Received message: Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Value: ${messageValue}`)
            
            const parsedMessage = JSON.parse(messageValue)
            await dataTransferService.transferAreaData([parsedMessage], topic)

        } catch (error) {
            this.logger.error('Error processing message:', error)
        }
    }

    async start() {
        try {
            await this.connect()
            await this.subscribe()
            await this.run(this.handleMessage.bind(this))
        } catch (error) {
            this.logger.error('Failed to start:', error)
            throw error
        }
    }
}

async function init() {
    try {
        if (!CONSUMER_AREA_ENABLED) {
            console.warn(`${ConsumerAreaHandler.name} is disabled`)
            return
        }
        const consumer = new ConsumerAreaHandler()
        await consumer.start()
        console.info(`${ConsumerAreaHandler.name} started successfully`)
    } catch (error) {
        console.error('Failed to start area consumer:', error)
    }
}

module.exports = {
    init
}