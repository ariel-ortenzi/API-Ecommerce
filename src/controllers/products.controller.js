import { productDao } from "../dao/mongoDao/products.dao.js";
import { productModel } from "../models/product.model.js";

class ProductsController {

    async getAll( req, res ) {
        const { limit, page, sort, category, status } = req.query;
    
        try {
            const options = {
                limit: limit || 10,
                page: page || 1,
                sort: {
                    price: sort === "asc" ? 1 : -1,
                },
                lean: true,
            }
    
            if(status){
                const products =  await productDao.getAll({status: status }, options);
                return res.status(200).json({ status:"ok", payload: products});        
            }
    
            if(category){
                const products =  await productDao.getAll({category: category }, options);
                return res.status(200).json({ status:"ok", payload: products});        
            }
    
            const products =  await productDao.getAll({}, options);
            res.status(200).json({ status:"ok", payload: products});
            
        } catch (error) {
            console.log(error); 
            res.status(404).send(error.message);
        }
    
    }; 
    
    async getById ( req, res ) {
        const { pid } =  req.params;
        try {
            const product =  await productDao.getById(pid);
            if(!product) return res.status(404).json({ status: "error", message: `Product id ${pid} not found`});
            res.status(200).json({ status:"ok", payload: product});
    
        } catch (error) {
            console.log(error);
            res.status(404).send(error.message);
        }
    };
    
    async create ( req, res ) {
        const body = req.body;
    
        try {
            const product = await productDao.create(body);
            res.status(200).json({ status:"ok", payload: product});
    
        } catch (error) {
            console.log(error);
            res.status(404).send(error.message);
        }
    };
    
    async update ( req, res ) {
        const { pid } =  req.params;
        const body = req.body;
    
        try {
            const findProduct = await productDao.getById(pid);
            if(!findProduct) return res.status(404).json({ status: "error", message: `Product id ${pid} not found`});
    
            const product =  await productDao.update(pid, body);
            res.status(200).json({ status:"ok", payload: product});
    
        } catch (error) {
            console.log(error);
            res.status(404).send(error.message);
        }
    };
    
    async delete ( req, res ) {
        const { pid } =  req.params;
        try {
            const findProduct = await productDao.delete(pid);
            if(!findProduct) return res.status(404).json({ status: "error", message: `Product id ${pid} not found`});
    
            await productModel.findByIdAndDelete(pid);
    
            res.status(200).json({ status:"ok", payload: `Product id ${pid} deleted`});
    
        } catch (error) {
            console.log(error);
            res.status(404).send(error.message);
        }
    };
}

    export const productsController = new ProductsController();