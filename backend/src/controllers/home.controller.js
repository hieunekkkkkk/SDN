const logger = require('../log/logger')
const Business = require('../models/business.model')
const Category = require('../models/category.model')

const homeController = async (req, res) => {
    try {
        // Get top rated businesses
        const topBusinesses = await Business.find()
            .sort({ rating: -1 })
            .limit(4)
            .select('name location status images rating')

        // Get categories for services section
        const categories = await Category.find()
            .limit(3)
            .select('name description image')

        // Get business statistics
        const totalBusinesses = await Business.countDocuments()
        const activeBusinesses = await Business.countDocuments({ status: 'active' })
        const totalCategories = await Category.countDocuments()
        const totalProducts = await Business.aggregate([
            { $unwind: '$products' },
            { $count: 'total' }
        ])

        res.json({
            topBusinesses,
            categories,
            stats: {
                totalBusinesses,
                activeBusinesses,
                totalCategories,
                totalProducts: totalProducts[0]?.total || 0
            }
        })
    } catch (error) {
        logger.error("Error occurred while accessing home page", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { homeController };