const logger = require('../log/logger')

const homeController = (req, res) => {
    try {
        logger.info("welcome home page")
        res.send("welcome Home Page")
    } catch (error) {
        logger.error("Error occurred while accessing home page", error)
    }
}

module.exports = { homeController };