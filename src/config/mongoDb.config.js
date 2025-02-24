import mongoose from "mongoose";
import dotenv from "dotenv";

import { CONFIG } from "./config.js"

dotenv.config();

export const mongoUri = CONFIG.MONGO_URI;

export const connectMongoDB = async () => {
    try {
        if (!mongoUri) {
            throw new Error("La variable MONGO_URL no está definida en el archivo .env");
        }

        await mongoose.connect(CONFIG.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
};

