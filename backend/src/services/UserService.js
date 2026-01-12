import User from "../models/User.js";

const UserService = {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  },

  async createUser(data) {
    return User.create(data);
  },

  async getUsers() {
    return User.findAll({
      attributes: { exclude: ["password"] }, 
      order: [["id", "ASC"]],
    });
  },

  async getUserById(id) {
    return User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  },

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    const plain = user.get({ plain: true });
    delete plain.password;
    return plain;
  },

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  },
};

export default UserService;
