import { userModel } from "../../models/user.model.js";

class UserService {
    async getAll() {
        return userModel.find();
    }

    /**
     *
     * @param { string } id
     * @returns { Promise<User> }
     */
    async getById({ id }) {
        return userModel.findById(id);
    }

    async create({ user }) {
        return userModel.create(user);
    }

    async update({ id, user }) {
        return userModel.findByIdAndUpdate(id, user, { new: true });
    }
}

export const userDao = new UserService();