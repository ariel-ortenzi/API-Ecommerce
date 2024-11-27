import fs from "fs";
import { v4 as uudi } from "uuid"
import { ProductManager } from "./productManager.js";

const productManager = new ProductManager();

export class CartsManager {
        constructor() {
                this.carts = [];
                this.path = "./src/managers/data/carts.json";
        }


async createCart() {

    const newCart = {
            id: uudi(),
            products: [],
    };

    this.carts.push(newCart);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

    return newCart;
}


async getCarts() {
    const file = await fs.promises.readFile(this.path, "utf-8");
    const fileParse = JSON.parse(file);

    this.carts = fileParse;
    return this.carts;
}

async getCartsById(id) {
    await this.getCarts();
    const cart = this.carts.find((cart) => cart.id === id);
    if (!cart) throw new Error(`No se encuentra el carrito con el id ${id}`);
    return cart;
}

async AddToCart(cid, pid ) {
    // Valido que exista el carrito.
    const cart = await this.getCartsById(cid);
        if (!cart) throw new Error(`No se encontró el carrito con ID: ${cid}`);
    // Valido que exista el producto.
    const product = await productManager.getProductById(pid);
        if (!product) throw new Error(`No se encontró el producto con ID: ${pid}`);
    // Busco el index del producto por el ID.
    const productIndex = cart.products.findIndex(prod => prod.id === pid);

    // Si existe sumo +1 en quantity si no existe creo el ID y el quantity en 1.
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ id: pid, quantity: 1 });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

    return cart;
}
};