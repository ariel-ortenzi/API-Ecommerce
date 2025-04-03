import { userMocksModel } from "../../models/userMocks.model.js";

class UserMocksService {
    async getAll() {
        return userMocksModel.find();
    }

    /**
     *
     * @param { string } id
     * @returns { Promise<User> }
     */
    async getById({ id }) {
        return userMocksModel.findById(id);
    }

    async create(userMocks) {
        userMocks.forEach(user => {
            if (user.cart && Array.isArray(user.cart)) {
                user.cart = user.cart.filter(product => product && typeof product === 'object');
            } else {
                user.cart = [];
            }
        });

        return userMocksModel.insertMany(userMocks);
    }

    async update({ id, user }) {
        return userMocksModel.findByIdAndUpdate(id, user, { new: true });
    }

    async getAllCarts() {
        const users = await userMocksModel.find({}, "firstName lastName cart");
    
        return users.map(user => ({
            user: `${user.firstName} ${user.lastName}`,
            cart: user.cart
        }));
    }
}



export const userMocksService = new UserMocksService();