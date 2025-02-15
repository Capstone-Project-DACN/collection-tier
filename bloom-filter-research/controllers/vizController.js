const path = require("path")

exports.renderFrontend = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
}
