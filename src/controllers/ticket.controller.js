import { ticketPurchasedDao } from "../dao/mongoDao/ticket.service.js";
import { cartModel } from "../models/cart.model.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js"
import { productDao } from "../dao/mongoDao/products.dao.js";


class TicketPurchasedController {
    async getAll(req, res) {
        try {
            const tickets = await ticketPurchasedDao.getAll();
            res.status(200).json({ tickets });
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
            const ticket = await ticketPurchasedDao.getById({ id });

            if (!ticket) {
                return res.status(404).json({
                    error: "Ticket not found",
                });
            }

            res.status(200).json({ ticket });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error,
            });
        }
    }

    async create(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await cartModel.findById(cartId).populate("products.product");

            if (!cart) return res.status(404).json({ error: "Cart not found" });

            let totalPrice = 0;
            let productsWithoutStock = [];
            
            for (const item of cart.products) {
                const product = await productDao.getById(item.product);

                if (!product) {
                    console.error(`Product with ID ${item.product} not found`);
                    return res.status(400).json({ error: `Product with ID ${item.product} not found` });
                }

                // Validación de stock
                if (product.stock < item.quantity) {
                    productsWithoutStock.push(product.title);
                }

                // Acumulador de precio total
                const price = product.price || 0;
                const quantity = item.quantity || 0;
                totalPrice += price * quantity;
            }

            if (productsWithoutStock.length > 0) {
                console.error(`Insufficient stock for the following products: ${productsWithoutStock.join(", ")}`);
                return res.status(400).json({
                    error: `Insufficient stock for the following products: ${productsWithoutStock.join(", ")}`,
                });
            }

            // Obtener el número de ticket
            const ticketNumber = await ticketPurchasedDao.getTicketNumber();

            // Crear el ticket
            const ticket = await ticketPurchasedDao.create({
                ticket: {
                    number: ticketNumber,
                    products: cart.products,
                    totalPrice,
                },
            });

            // Elimino el carrito cuando se realiza la compra y se genera el ticket
            await cartDao.delete(cartId);

            res.status(201).json({ ticket });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
                details: error,
            });
        }
    }
}

export const ticketPurchasedController = new TicketPurchasedController();





