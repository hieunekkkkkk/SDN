const User = require('../entity/module/user.model');

class UserService {
    async getUserById(id) {
        return await User.findById(id);
    }
}

module.exports = new UserService();