const fs = require("fs")
const path = require("path")
const { getTimestamp } = require("./time")

const logsDir = path.join(__dirname, "../logs")
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

const logFile = path.join(logsDir, `performance ${getTimestamp()}.log`)

function logPerformance(action, data) {
    const logEntry = `[${new Date().toISOString()}] ${action}: ${JSON.stringify(data)}\n`
    try {
        fs.appendFileSync(logFile, logEntry, { flag: "a" })  // Synchronous write
    } catch (err) {
        console.error("Logging failed:", err)
    }
}

module.exports = { logPerformance }
