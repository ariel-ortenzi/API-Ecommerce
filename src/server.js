import express, { urlencoded } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import session from "express-session"


//import routes
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js";
import { connectMongoDB, mongoUrl } from "./config/mongoDb.config.js";
import { authRouter } from "./router/auth.routes.js";
import { initializePassport } from "./config/passport.config.js";
import { JWT_SECRET } from "./utils/jwt.js";

connectMongoDB();
const PORT = 8080;
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded( {extended:true} ));


app.use(
    session({
        secret: JWT_SECRET,
        store: MongoStore.create({
            mongoUrl,
            ttl: 15,
        }),
        resave: false,
        saveUninitialized: false,
    })
);

//Passport
initializePassport();
app.use(passport.initialize());

//routes
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/auth", authRouter);


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});