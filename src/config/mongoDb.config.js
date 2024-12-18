import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        mongoose.connect("mongodb+srv://arielortenzi:EeNg4enEyKB2UOjr@cluster70395.ug2ox.mongodb.net/E-commerce");
        console.log("MongoDB Connected")
    } catch (error) {
        
    }
}