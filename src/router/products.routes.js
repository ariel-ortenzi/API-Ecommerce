import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();


router.get("/", async(req, res) => {
    const { limit } = req.query;

    try {
        const products =  await productManager.getProducts(limit);
        res.status(200).send(products);
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }

});

router.get("/:pid", async (req, res ) => {
    const { pid } =  req.params;
    try {
        const product =  await productManager.getProductById(Number(pid));

        res.status(200).send(product);

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.post("/", async (req, res) => {
    const body = req.body;

    try {
        const product = await productManager.addProduct(body);

        res.status(200).send(product);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.put("/:pid", async (req, res ) => {
    const { pid } =  req.params;
    const body = req.body;

    try {
        const product =  await productManager.updateProduct(pid, body);

        res.status(200).send(product);

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.delete("/:pid", async (req, res ) => {
    const { pid } =  req.params;
    try {
        const product =  await productManager.deleteProduct(pid);

        res.status(200).send(product);

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

export default router;