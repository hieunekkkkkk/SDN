const { Clerk } = require('@clerk/clerk-sdk-node');

class UserService {
  constructor() {
    this.clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
  }

  async getAllUsers(page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;

      const totalItems = await this.clerk.users.getCount()

      const userList = await this.clerk.users.getUserList({ limit, offset });
      const users = userList.map(user => ({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.publicMetadata?.role || 'client', // Prefer publicMetadata here
        imageUrl: user.imageUrl,
        publicMetadata: user.publicMetadata || {},
        privateMetadata: user.privateMetadata || {}
      }));


      return {
        users,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.clerk.users.getUser(userId);
      if (!user) return null;
      const users = userList.map(user => ({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.publicMetadata?.role || 'client', // Prefer publicMetadata here
        imageUrl: user.imageUrl,
        publicMetadata: user.publicMetadata || {},
        privateMetadata: user.privateMetadata || {}
      }));
      return {
        users
      };
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const updatedUser = await this.clerk.users.updateUser(userId, updateData);
      return {
        id: updatedUser.id,
        email: updatedUser.emailAddresses[0]?.emailAddress,
        fullName: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim(),
        role: updatedUser.unsafeMetadata?.role || 'client',
        imageUrl: updatedUser.imageUrl
      };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}

module.exports = new UserService();
