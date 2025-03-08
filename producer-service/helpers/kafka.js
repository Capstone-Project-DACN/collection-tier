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
} = require('../config')
const { v4 : uuidv4 } = require('uuid')

const debugTag = 'KAFKA'

const kafkaClient = new Kafka({
    clientId: KAFKA_CLIENT_ID,
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

    const dataArray = Array.isArray(data) ? data : [data]

    const msgs = dataArray.map(item => ({
        key: uuidv4(),
        value: (typeof item === 'object') ? JSON.stringify(item) : String(item)
    }))

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

const getMetadata = async () => {
    try {
        const metadata = await kafkaClient.admin().fetchTopicMetadata()
        console.log(`[${debugTag}] Kafka Metadata:`, metadata)
    } catch (error) {
        console.error(`[${debugTag}] Failed to fetch metadata:`, error?.message || error)
    }
}

module.exports = {
    connect,
    singleToneConnect,
    disconnect,
    publishMsg,
    getMetadata
}
