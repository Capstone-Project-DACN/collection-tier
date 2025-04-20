function getRandomInt(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start
}

const randomDataGenerator = (dataGenerators) => {
    const randomIndex = Math.floor(Math.random() * dataGenerators.length)
    return dataGenerators[randomIndex]()
}

module.exports = {
    getRandomInt,
    randomDataGenerator
}
