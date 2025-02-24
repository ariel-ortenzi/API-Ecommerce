import { userDao } from "../dao/mongoDao/users.dao.js";
import { orderDao } from "../dao/mongoDao/order.dao.js";
import { productModel } from "../models/product.model.js";


class OrderController {
    async getAll(req, res) {
        try {
            const orders = await orderDao.getAll();
            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error,
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const order = await orderDao.getById({ id });

            if (!order) {
                return res.status(404).json({
                    error: "Order not found",
                });
            }

            res.status(200).json({ order });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error,
            });
        }
    }

    async create(req, res) {
        try {
            const {
                user: userId,
                products: productsIds,
            } = req.body;

            const user = await userDao.getById({ id: userId });

            if (!user) return res.status(404).json({ error: "User not found" });

            const products = await productModel.find({_id: { $in: productsIds}})

            if (products.length !== productsIds.length) {
                return res.status(400).json({ error: "Invalid products ids" });
            }

            const totalPrice = products.reduce((acc, product) => {
                return acc + product.price;
            }, 0);

            const orderNumber = await orderDao.getOrderNumber();

            console.log(orderNumber);

            const order = await orderDao.create({
                order: {
                    number: orderNumber,
                    user: userId,
                    products,
                    totalPrice,
                },
            });

            res.status(201).json({ order });
        } catch (error) {
            console.log(error);

            res.status(500).json({
                error: "Internal server error",
                details: error,
            });
        }
    }

    async resolve(req, res) {
        try {
            const { id } = req.params;
            const { resolve } = req.body;

            const order = await orderDao.getById({ id });

            if (!order) {
                return res.status(404).json({
                    error: "Order not found",
                });
            }

            if (order.status !== "pending") {
                return res.status(400).json({
                    error: "Order already resolved",
                });
            }

            if (resolve !== "cancelled" && resolve !== "completed") {
                return res.status(400).json({
                    error: "Invalid resolve value",
                });
            }

            order.status = resolve;

            const updatedOrder = await orderDao.update({ id, order });

            res.status(200).json({ order: updatedOrder });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error,
            });
        }
    }
}

export const orderController = new OrderController();