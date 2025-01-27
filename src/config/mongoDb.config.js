import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const mongoUrl = process.env.MONGO_URL;

export const connectMongoDB = async () => {
    try {
        if (!mongoUrl) {
            throw new Error("La variable MONGO_URL no está definida en el archivo .env");
        }

        await mongoose.connect(mongoUrl);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
};
