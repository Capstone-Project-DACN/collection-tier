const { Kafka } = require('kafkajs')
const { 
    KAFKA_CLIENT_ID,
    BOOTSTRAP_SERVER,
    KAFKA_API_KEY,
    KAFKA_API_SECRET,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    ALLOW_AUTO_TOPIC_CREATION,
    TRANSACTION_TIMEOUT
} = require('../configs/KafkaConfig')
const { v4 : uuidv4 } = require('uuid')

const debugTag = 'KAFKA-PRODUCER'

class KafkaProducerManager {
    constructor(clientId = KAFKA_CLIENT_ID) {
        this.kafkaClient = new Kafka({
            clientId: clientId,
            brokers: [BOOTSTRAP_SERVER],
            // sasl: {
            //     mechanism: 'plain',
            //     username: KAFKA_API_KEY,
            //     password: KAFKA_API_SECRET
            // },
            // ssl: true,
            requestTimeout: REQUEST_TIMEOUT,
            connectionTimeout: CONNECTION_TIMEOUT,
            allowAutoTopicCreation: ALLOW_AUTO_TOPIC_CREATION === 1
        })
        this.producers = {}
    }

    async createProducer(producerId) {
        if (this.producers[producerId]) {
            console.warn(`[${debugTag}] Producer with ID ${producerId} already exists`)
            return this.producers[producerId]
        }

        const newProducer = this.kafkaClient.producer({
            allowAutoTopicCreation: ALLOW_AUTO_TOPIC_CREATION === 1,
            transactionalId: `producer-${producerId}-${uuidv4()}`,
            transactionTimeout: TRANSACTION_TIMEOUT
        })

        this.producers[producerId] = newProducer

        try {
            await newProducer.connect()
            console.log(`[${debugTag}] Producer ${producerId} connected successfully`)
            return newProducer
        } catch (error) {
            console.error(`[${debugTag}] Failed to connect producer ${producerId}:`, error?.message || error)
            delete this.producers[producerId]
            return null
        }
    }

    async getProducer(producerId) {
        if (this.producers[producerId]) {
            return this.producers[producerId]
        } else {
            return await this.createProducer(producerId)
        }
    }

    async disconnectProducer(producerId) {
        const producer = this.producers[producerId]
        if (producer) {
            try {
                await producer.disconnect()
                console.log(`[${debugTag}] Producer ${producerId} disconnected successfully`)
                delete this.producers[producerId]
            } catch (error) {
                console.error(`[${debugTag}] Failed to disconnect producer ${producerId}:`, error?.message || error)
            }
        }
    }
    async disconnectAllProducers(){
        const disconnectPromises = Object.keys(this.producers).map(producerId => this.disconnectProducer(producerId));
        await Promise.all(disconnectPromises);
    }
    async publishMsg(producerId, topic, data, extractKey) {
        const producer = await this.getProducer(producerId)
        if (!producer) {
            console.error(`[${debugTag}] Producer ${producerId} not found or failed to connect`)
            return
        }

        const dataArray = Array.isArray(data) ? data : [data]

        const msgs = dataArray.map(item => ({
            key: extractKey ? extractKey(item) : null,
            value: (typeof item === 'object') ? JSON.stringify(item) : String(item)
        }))

        try {
            await producer.send({
                topic,
                messages: msgs,
                timeout: REQUEST_TIMEOUT
            })
            console.log(`[${debugTag}] [Producer ${producerId}] Publish ${msgs.length} messages to topic ${topic} successfully!`)
        } catch (error) {
            console.error(`[${debugTag}] [Producer ${producerId}] Publish ${msgs.length} messages to topic ${topic} Failed:`, error?.message || error)
        }
    }

    async getMetadata() {
        try {
            const metadata = await this.kafkaClient.admin().fetchTopicMetadata()
            console.log(`[${debugTag}] Kafka Metadata:`, metadata)
        } catch (error) {
            console.error(`[${debugTag}] Failed to fetch metadata:`, error?.message || error)
        }
    }
}

const kafkaProducerManager = new KafkaProducerManager();
module.exports = kafkaProducerManager
