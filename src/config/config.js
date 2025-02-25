import { config } from "dotenv";

config();

export const  CONFIG = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MAIL: {
        FROM: process.env.NODEMAILER_FROM,
        USER: process.env.NODEMAILER_USER,
        PASSWORD: process.env.NODEMAILER_PASSWORD,
        HOST: process.env.NODEMAILER_HOST,
        PROT: process.env.NODEMAILER_PORT,
    }
};