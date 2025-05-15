import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productDao } from "../dao/mongoDao/products.dao.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cart = await cartDao.create({});
        res.json({ status: "ok", payload: cart });
    } catch (error) {
        res.status(404).send(error.message);
    }
});


router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const findProduct = await productDao.getById(pid);
        if (!findProduct)
            return res.json({ status: "error", message: `Product ID ${pid} not found` });

        const cart = await cartDao.getById(cid);
        if (!cart)
            return res.json({ status: "error", message: `Cart ID ${cid} not found` });

        const productInCart = cart.products.find((productCart) => productCart.product.toString() === pid);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        const updatedCart = await cartDao.update(cid, { products: cart.products }, { new: true });

        res.json({ status: "ok", payload: updatedCart });

    } catch (error) {
        res.status(404).send(error.message);
    }
});


router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.json({ status: "error", message: `Cart id ${cid} not found` });
        }

        cart.products = products;

        const updatedCart = await cartDao.update(cid, cart);
        res.json({ status: "ok", payload: updatedCart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.json({ status: "error", message: `Cart id ${cid} not found` });
        }

        const product = cart.products.find((prod) => prod.product.toString() === pid);
        if (!product) {
            return res.json({ status: "error", message: `Product ID ${pid} not found in cart` });
        }

        product.quantity = quantity;

        const updatedCart = await cartDao.update(cid, cart);
        res.json({ status: "ok", payload: updatedCart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.json({ status: "error", message: `Cart ID ${cid} not found` });
        }

        cart.products = [];

        const updatedCart = await cartDao.update(cid, cart);
        res.json({ status: "ok", payload: updatedCart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid).populate("products.product");

        if (!cart) {
            return res.status(500).json({ status: "error", message: `Cart ID ${cid} not found` });
        }

        res.json({ status: "ok", payload: cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const product = await productDao.getById(pid)
        if (!product) return res.json({ status: "error", message: `Product id ${pid} not found` });

        const cart = await cartDao.getById(cid);
        if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });

        const cartUpdated = await cartDao.deleteProductInCart(cid, pid);

        res.json({ status: "ok", payload: cartUpdated });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const product = await productDao.getById(pid)
        if (!product) return res.json({ status: "error", message: `Product id ${pid} not found` });

        const cart = await cartDao.getById(cid);
        if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });

        const cartUpdated = await cartDao.updateProductInCart(cid, pid, quantity);

        res.json({ status: "ok", payload: cartUpdated });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });

        const cartUpdated = await cartDao.deleteProductsInCart(cid);

        res.json({ status: "ok", payload: cartUpdated });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;