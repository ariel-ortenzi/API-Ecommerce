import { Router } from "express";
import { userMocksService } from "../dao/mongoDao/userMocks.service.js";
import { generateMockUsersWithProducts } from "../dao/mongoDao/mocks.service.js";

export const mocksRoutes = Router();

mocksRoutes.get('/mockingusers/:count', async (req, res) => {
    const count = parseInt(req.params.count, 10);

    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ error: "The 'count' parameter must be a number greater than 0" });
    }

    const users = await generateMockUsersWithProducts(count, 5);
    res.status(200).json({ status: "ok", payload: users });
});

mocksRoutes.post('/generatedata', async (req, res) => {
    try {
        const users = parseInt(req.body.users, 10);
        const products = parseInt(req.body.products, 10);

        if (isNaN(users) || users <= 0 || isNaN(products) || products <= 0) {
            return res.status(400).json({ error: "The 'users' and 'products' parameters must be numbers greater than 0" });
        }

        const userMocks = await generateMockUsersWithProducts(users, products);
        await userMocksService.create(userMocks);

        res.status(201).json({
            message: 'Sucess',
            users: userMocks.length,
            carts: userMocks.map(user => user.cart.length)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

mocksRoutes.get('/users', async (req, res) => {
    try {
        const users = await userMocksService.getAll();
        res.status(200).json({ status: "ok", payload: users });
    } catch (error) {
        console.error("User error:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

mocksRoutes.get('/carts', async (req, res) => {
    try {
        const carts = await userMocksService.getAllCarts();
        res.status(200).json({ status: "ok", payload: carts });
    } catch (error) {
        console.error("Carts error:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

export default mocksRoutes;

