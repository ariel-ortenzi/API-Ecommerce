import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";
import { productModel } from "../models/product.model.js"

const router = Router();
const productManager = new ProductManager();


router.get("/", async(req, res) => {
    const { limit } = req.query;

    try {
        const products =  await productModel.find();
        res.status(200).json({ status:"ok", payload: products});
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }

});

router.get("/:pid", async (req, res ) => {
    const { pid } =  req.params;
    try {
        const product =  await productModel.findById(pid);
        res.status(200).json({ status:"ok", payload: product});

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.post("/", async (req, res) => {
    const body = req.body;

    try {
        const product = await productModel.create(body);
        res.status(200).json({ status:"ok", payload: product});

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.put("/:pid", async (req, res ) => {
    const { pid } =  req.params;
    const body = req.body;

    try {
        const findProduct = await productModel.findById(pid);
        if(!findProduct) return res.status(404).json({ status: "error", message: `Product id ${pid} not found`});

        const product =  await productModel.findByIdAndUpdate(pid, body, { new: true })
        res.status(200).json({ status:"ok", payload: product});

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.delete("/:pid", async (req, res ) => {
    const { pid } =  req.params;
    try {
        const findProduct = await productModel.findById(pid);
        if(!findProduct) return res.status(404).json({ status: "error", message: `Product id ${pid} not found`});

        const product =  await productModel.findByIdAndDelete(pid)

        res.status(200).json({ status:"ok", payload: `Product id ${pid} deleted`});

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

export default router;