const { Kafka } = require('kafkajs')
const { 
    KAFKA_CLIENT_ID,
    KAFKA_BROKERS,
    REQUEST_TIMEOUT,
    CONNECTION_TIMEOUT,
    ALLOW_AUTO_TOPIC_CREATION,
    TRANSACTION_TIMEOUT
} = require('../config')
const { v4 : uuidv4 } = require('uuid')

const debugTag = 'KAFKA'

const kafkaClient = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS,
    requestTimeout: REQUEST_TIMEOUT,
    connectionTimeout: CONNECTION_TIMEOUT,
    allowAutoTopicCreation: ALLOW_AUTO_TOPIC_CREATION === 1
})

const producer = kafkaClient.producer({
    allowAutoTopicCreation: ALLOW_AUTO_TOPIC_CREATION === 1,
    transactionalId: `producer-${uuidv4()}`,
    transactionTimeout: TRANSACTION_TIMEOUT
})
let isConnected = false

const connect = async () => {
    try {
        await producer.connect()
        console.log(`[${debugTag}] Producer connected successfully`)
    } catch (error) {
        console.error(`[${debugTag}] Failed to connect producer:`, error?.message || error)
    }
}

const disconnect = async () => {
    try {
        await producer.disconnect()
        console.log(`[${debugTag}] Producer disconnected successfully`)
    } catch (error) {
        console.error(`[${debugTag}] Failed to disconnect producer:`, error?.message || error)
    }
}

const singleToneConnect = async () => {
    if (!isConnected) {
        try {
            await producer.connect()
            isConnected = true
            console.log(`[${debugTag}] Producer connected successfully`)
        } catch (error) {
            isConnected = false
            console.error(`[${debugTag}] Failed to connect producer:`, error?.message || error)
        }
    }
}

const publishMsg = async (topic, data) => {
    await singleToneConnect()

    const formattedData = (typeof data === 'object') ? JSON.stringify(data) : String(data)
    const msgs = [
        { key: uuidv4(), value: formattedData }
    ]

    try {
        await producer.send({
            topic,
            messages: msgs,
            timeout: REQUEST_TIMEOUT
        })
        console.log(`[${debugTag}] Publish ${msgs.length} messages to topic ${topic} successfully!`)
    } catch (error) {
        console.error(`[${debugTag}] Publish ${msgs.length} messages to topic ${topic} Failed:`, error?.message || error)
    }
}

module.exports = {
    connect,
    singleToneConnect,
    disconnect,
    publishMsg
}
