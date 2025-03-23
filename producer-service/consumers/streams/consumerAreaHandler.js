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
const CONSUMER_AREA_ENABLED = +process.env.CONSUMER_AREA_ENABLED

class ConsumerAreaHandler extends BaseConsumer {
    constructor(config) {
        const defaultConfig = {
            clientId: `${KAFKA_CLIENT_ID}-${uuidv4()}`,
            groupId: CONSUMER_GROUP_IDS[TOPIC_CONSUMER.AREA_DATA],
            topics: [TOPIC_CONSUMER.AREA_DATA],
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
            debug: true,
            ...config,
        }
        super(defaultConfig)
    }

    async handleMessage({ topic, partition, message }) {
        try {
            const messageValue = message.value.toString()
            this.logger.debug(`Received message: Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Value: ${messageValue}`)
            
            const parsedMessage = JSON.parse(messageValue)
            await dataTransferService.transferAreaData([parsedMessage])

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