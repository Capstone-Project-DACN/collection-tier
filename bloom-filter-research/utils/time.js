const getTimestamp = () => {
    const now = new Date()
    return now.toISOString().replace(/:/g, "-")
}

module.exports = {
    getTimestamp
}