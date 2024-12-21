import fs from "fs";
import { v4 as uudi } from "uuid"

export class ProductManager {
        constructor() {
                this.products = [];
                this.path = "./src/managers/data/product.json";
        }

        async getProducts(limit) {
                const file = await fs.promises.readFile(this.path, "utf-8");
                const fileParse = JSON.parse(file);

                this.products = fileParse || [];

                if (!limit) return this.products;

                return this.products.slice(0, limit);
        }

        async addProduct(product) {
                await this.getProducts();

                const { title, description, price, thumbnail, code, stock, category } = product;

                const newProduct = {
                        id: uudi(),
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status: true,
                        category,
                };

                // Valida que el código ya existe
                const productExist = this.products.find((product) => product.code === code);
                if (productExist) throw new Error(`Ya existe un producto con el código ${code}`);

                // Valida que todos los campos sean obligatorios
                const validateProperties = Object.values(newProduct);
                if (validateProperties.includes(undefined)) throw new Error("Todos los campos son obligatorios");

                this.products.push(newProduct);

                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));

                return newProduct;
        }

        async getProductById(id) {
                await this.getProducts();
                const product = this.products.find((product) => product.id === id);
                if (!product) throw new Error(`No se encuentra el producto con el id ${id}`);
                return product;
        }

        async updateProduct(id, data) {
                await this.getProductById(id);
                const index = this.products.findIndex((product) => product.id === id);
                const product = await this.getProductById(id);

                //Valido que los campos existan.
                const validKeys = Object.keys(product); 
                const invalidKeys = Object.keys(data).filter((key) => !validKeys.includes(key));
        
                if (invalidKeys.length > 0) {
                throw new Error(`Los siguientes campos no son válidos: ${invalidKeys.join(", ")}`);
                }

                this.products[index] = {
                        ...this.products[index],
                        ...data,
                };

                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));

                return this.products[index];
        }

        async deleteProduct(id) {
                await this.getProductById(id);

                this.products = this.products.filter((products) => products.id !== id);

                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));

                return `Producto con el ID ${id} eliminado`;
        }
}