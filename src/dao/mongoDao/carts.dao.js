import { cartModel } from "../models/cart.model.js";

class CartDao {
    async getAll() {
        return await cartModel.find();
    }

    async getById(id) {
        return await cartModel.findById(id);
    }

    async create(data) {
        return await cartModel.create(data);
    }

    async update(id, data) {
        return await cartModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await cartModel.findByIdAndDelete(id);
    }

    async deleteProductInCart(cid, pid) {
        const cart = await cartModel.findById(cid);
    
        if (!cart) {
            throw new Error("Cart not found");
        }
    
        const productIndex = cart.products.findIndex((product) => product.product._id.toString() === pid);
    
        if (productIndex === -1) {
            throw new Error("Product not found in cart");
        }
    
        cart.products.splice(productIndex, 1);
    
        const updatedCart = await cartModel.findByIdAndUpdate(cid, { products: cart.products }, { new: true });
    
        return updatedCart;
    }    
    
}

export const cartDao = new CartDao();