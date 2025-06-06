const BaseConsumer = require('../BaseConsumer')
const uuidv4 = require('uuid').v4
const { 
    KAFKA_CLIENT_ID,
    TOPIC_CONSUMER,
    CONSUMER_GROUP_IDS,
    BOOTSTRAP_SERVER,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    KAFKA_API_KEY,
    KAFKA_API_SECRET,
    ALLOW_AUTO_TOPIC_CREATION
} = require('../../configs/kafkaConfig')
const dataTransferService = require('../../services/DataTransferService')
const CONSUMER_ANOMALY_ENABLED = +process.env.CONSUMER_ANOMALY_ENABLED

class ConsumerAnomalyHandler extends BaseConsumer {
    constructor(config) {
        const defaultConfig = {
            clientId: `${KAFKA_CLIENT_ID}-${uuidv4()}`,
            groupId: `${KAFKA_CLIENT_ID}-${CONSUMER_GROUP_IDS.ANOMALY}`,
            topics: [TOPIC_CONSUMER.ANOMALY],
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
            await dataTransferService.transferAnomalyData([parsedMessage], topic)

        } catch (error) {
            this.logger.error('Error processing message:', error)
            console.error(error)
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
        if (!CONSUMER_ANOMALY_ENABLED) {
            console.warn(`${ConsumerAnomalyHandler.name} is disabled`)
            return
        }
        const consumer = new ConsumerAnomalyHandler()
        await consumer.start()
        console.info(`${ConsumerAnomalyHandler.name} started successfully`)
    } catch (error) {
        console.error('Failed to start anomaly consumer:', error)
    }
}

module.exports = {
    init
}