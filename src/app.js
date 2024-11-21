import express, { urlencoded } from "express";

//import routes
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js";

const PORT = 8080;
const app = express();

//middlewares
app.use(express.json());
app.use(urlencoded( {extended:true} ));

//routes
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});