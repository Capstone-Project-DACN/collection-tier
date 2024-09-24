function pushDatatoMQ(data) {
    console.log(`Mock produced to Kafka: ${JSON.stringify(data)}`)
}

module.exports = {
    pushDatatoMQ
}
