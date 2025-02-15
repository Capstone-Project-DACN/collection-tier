const fs = require("fs");
const path = require("path");
const { getTimestamp } = require("./time")

const logFile = path.join(__dirname, `../logs/performance ${getTimestamp()}.log`)

function logPerformance(action, data) {
    const logEntry = `[${new Date().toISOString()}] ${action}: ${JSON.stringify(data)}\n`
    try {
        fs.appendFileSync(logFile, logEntry, { flag: "a" })  // Synchronous write
    } catch (err) {
        console.error("Logging failed:", err)
    }
}

module.exports = { logPerformance };
