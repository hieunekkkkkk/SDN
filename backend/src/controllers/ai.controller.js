const AiService = require('../services/ai.service');

class AiController {
    async getAllBusinessWithProducts(req, res) {
        try {
            const businessesWithProducts = await AiService.getAllBusinessWithProducts();
            res.status(200).json(businessesWithProducts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new AiController();