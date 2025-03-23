const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
}

function msToDateTime(ms) {
    return new Date(ms).toISOString()
}

module.exports = {
    sleep,
    formatDuration,
    msToDateTime
}