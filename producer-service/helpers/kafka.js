const { Kafka } = require('kafkajs')
const { KAFKA_CLIENT_ID, KAFKA_BROKERS } = require('../config')

const debugTag = 'KAFKA'

const kafkaClient = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS
})

const producer = kafkaClient.producer()
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

    const msgs = [
        data
    ]

    try {
        await producer.send({
            topic,
            messages: msgs
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
