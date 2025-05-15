import { Router } from "express";
import { userMocksService } from "../dao/mongoDao/userMocks.service.js";
import { generateMockUsersWithProducts } from "../dao/mongoDao/mocks.service.js";

export const mocksRoutes = Router();

mocksRoutes.get('/mockingusers/:count', async (req, res) => {
    const count = parseInt(req.params.count, 10);

    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ error: "El parámetro 'count' debe ser un número mayor que 0" });
    }

    const users = await generateMockUsersWithProducts(count, 5);
    res.status(200).json({ status: "ok", payload: users });
});

mocksRoutes.post('/generatedata', async (req, res) => {
    try {
        const users = parseInt(req.body.users, 10);
        const products = parseInt(req.body.products, 10);

        if (isNaN(users) || users <= 0 || isNaN(products) || products <= 0) {
            return res.status(400).json({ error: "Los parámetros 'users' y 'products' deben ser números mayores que 0" });
        }

        const userMocks = await generateMockUsersWithProducts(users, products);
        await userMocksService.create(userMocks);

        res.status(201).json({
            message: 'Datos generados correctamente',
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
        console.error("Error obteniendo usuarios:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

mocksRoutes.get('/carts', async (req, res) => {
    try {
        const carts = await userMocksService.getAllCarts();
        res.status(200).json({ status: "ok", payload: carts });
    } catch (error) {
        console.error("Error obteniendo carts:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

export default mocksRoutes;

