import { Router } from "express";
import { ticketPurchasedController } from "../controllers/ticket.controller.js";

export const ticketPurchasedRoutes = Router();

ticketPurchasedRoutes.get("/", ticketPurchasedController.getAll);
ticketPurchasedRoutes.get("/:id", ticketPurchasedController.getById);
ticketPurchasedRoutes.post("/:cartId/purchase", ticketPurchasedController.create);