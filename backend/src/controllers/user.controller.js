const UserService = require('../services/user.service');
const UserDTO = require('../entity/dto/user.dto');

class UserController {
    async getUser(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(new UserDTO(user));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController();