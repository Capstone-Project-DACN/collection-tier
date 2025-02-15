const path = require("path")

exports.renderFrontend = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
}
