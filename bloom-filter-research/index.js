const express = require("express")
const cors = require("cors")
const deviceRoutes = require("./routes/devices")
const vizRoutes = require("./routes/visualization")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/devices", deviceRoutes)
app.use("/bloom-filter/visualization", vizRoutes)

const PORT = process.env.PORT || 8082
app.listen(PORT, () => {
    console.info(`[${new Date().toISOString()}] Server running on port ${PORT}`)
    console.info(`[${new Date().toISOString()}] Visualization available at: http://localhost:${PORT}/bloom-filter/visualization`)
})
