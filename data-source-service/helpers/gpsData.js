function getRandomCoordinate(min, max) {
    return (Math.random() * (max - min) + min).toFixed(6)
}

function generateGPSData() {
    const latitude = getRandomCoordinate(-90, 90)
    const longitude = getRandomCoordinate(-180, 180)
    const timestamp = new Date().toISOString()

    return new Promise((resolve, reject) => {
        const gpsObj = {
            latitude,
            longitude,
            timestamp
        }
        resolve(gpsObj)
    })
}

module.exports = {
    generateGPSData
}
