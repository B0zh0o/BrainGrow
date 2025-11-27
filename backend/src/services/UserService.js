import { User } from "../models/index.js";

const UserService = {
    async findByEmail(email) {
        return User,findOne({ where: { email } });
    },

    async createUser(data) {
        return User, create(data);
    }
};

export default UserService;