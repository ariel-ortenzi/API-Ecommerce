import { Router } from "express";

import { orderRoutes } from "./order.routes.js";
import { productsRouter } from "./products.routes.js";

export const router = Router();

router.use("orders", orderRoutes);
router.use("products", productsRouter);