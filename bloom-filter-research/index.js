const express = require("express")
const cors = require("cors")
const path = require("path")
const deviceRoutes = require("./routes/devices")

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "./public")))

// Route to serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.use("/api/devices", deviceRoutes)

const PORT = process.env.PORT || 8082
app.listen(PORT, () => {
    console.info(`[${new Date().toISOString()}] Server running on port ${PORT}`)
    console.info(`[${new Date().toISOString()}] Visualization available at: http://localhost:${PORT}/`)
})
