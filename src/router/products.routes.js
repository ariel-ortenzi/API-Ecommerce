import { Router } from "express";
import { productDao } from "../dao/mongoDao/products.dao.js";
import { productsController } from "../controllers/products.controller.js";
import { validateDto } from "../middlewares/vadilate-dto.middleware.js"
import { productsDto } from "../dtos/products-dto.js";

export const productsRouter = Router();

productsRouter.get("/", productsController.getAll);
productsRouter.get("/:pid", productsController.getById);
productsRouter.post("/", validateDto(productsDto), productsController.create);
productsRouter.put("/:pid", productsController.update);
productsRouter.delete("/:pid", productsController.delete);

export default productsRouter;