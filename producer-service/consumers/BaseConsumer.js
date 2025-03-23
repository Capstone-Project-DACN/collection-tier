const { Kafka, logLevel } = require('kafkajs')

class BaseConsumer {
    constructor(config) {
        if (!config) {
            throw new Error('Config is required')
        }
        if (!config.brokers || !Array.isArray(config.brokers) || config.brokers.length === 0) {
            throw new Error('Brokers are required and must be a non-empty array')
        }
        if (!config.clientId) {
            throw new Error('ClientId is required')
        }
        if (!config.groupId) {
            throw new Error('GroupId is required')
        }
        if (!config.topics || !Array.isArray(config.topics) || config.topics.length === 0) {
            throw new Error('Topics are required and must be a non-empty array')
        }

        this.brokers = config.brokers
        this.clientId = config.clientId
        this.groupId = config.groupId
        this.topics = config.topics
        this.kafkaConfig = config.kafkaConfig || {}
        this.consumerConfig = config.consumerConfig || {}
        this.kafka = null
        this.consumer = null
        this.isRunning = false
        this.logLevel = config.debug || false ? logLevel.DEBUG : logLevel.INFO
        this.logger = null
        this.batch = config.batch || false
    }

    async connect() {
        try {
            this.kafka = new Kafka({
                clientId: this.clientId,
                brokers: this.brokers,
                ...this.kafkaConfig,
            })

            this.consumer = this.kafka.consumer({
                groupId: this.groupId,
                ...this.consumerConfig,
            })

            this.logger = this.kafka.logger({
                logLevel: this.logLevel,
            })

            await this.consumer.connect()

            this.logger.info(`Consumer ${this.clientId} connecting to Kafka brokers: ${this.brokers.join(', ')}`)
        } catch (error) {
            this.logger.error(`Error connecting consumer ${this.clientId} to Kafka:`, error)
            throw error
        }
    }

    async subscribe() {
        try {
            const subscriptions = this.topics.map(async (topic) => {
                await this.consumer.subscribe({ topic, fromBeginning: false })
                this.logger.info(`Consumer ${this.clientId} subscribed to topic: ${topic}`)
            })
            await Promise.all(subscriptions)
        } catch (error) {
            this.logger.error(`Error subscribing consumer ${this.clientId} to topics:`, error)
            throw error
        }
    }

    async run(handler) {
        if (!handler || typeof handler !== 'function') {
            throw new Error('Handler is required and must be a function')
        }
        if (!this.consumer) {
            throw new Error('Consumer is not initialized. Call connect() first.')
        }
        if (this.isRunning) {
            this.logger.warn('Consumer is already running.')
            return
        }

        try {
            if (this.batch) {
                await this.consumer.run({
                    eachBatch: async ({ batch, resolve, heartbeat, commitOffsetsIfNecessary, isRunning, isStale }) => {
                        try {
                            await handler({ batch, resolve, heartbeat, commitOffsetsIfNecessary, isRunning, isStale })
                        } catch (error) {
                            this.logger.error(`Error processing batch in consumer ${this.clientId}:`, error)
                        }
                    },
                })
                this.logger.info(`Consumer ${this.clientId} is running and consuming batches.`)
            } else {
                await this.consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                        try {
                            await handler({ topic, partition, message })
                        } catch (error) {
                            this.logger.error(`Error processing message in consumer ${this.clientId}:`, error)
                        }
                    },
                })
                this.logger.info(`Consumer ${this.clientId} is running and consuming messages.`)
            }
            this.isRunning = true
        } catch (error) {
            this.logger.error(`Error running consumer ${this.clientId}:`, error)
            throw error
        }
    }

    async disconnect() {
        if (this.consumer) {
            try {
                await this.consumer.disconnect()
                this.isRunning = false
                this.logger.info(`Consumer ${this.clientId} disconnected from Kafka.`)
            } catch (error) {
                this.logger.error(`Error disconnecting consumer ${this.clientId} from Kafka:`, error)
            }
        }
    }
}

module.exports = BaseConsumer