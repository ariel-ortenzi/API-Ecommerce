import { Schema, model } from "mongoose";

const userMocksSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, },
    age: { type: String },
    password: { type: String },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user",
    },
    cart: [
        {
            title: { type: String },
            price: { type: String },
            department: { type: String },
            stock: { type: Number },
            id: { type: String },
            thumbnail: { type: String },
        },
    ], 
});

userMocksSchema.pre("save", async function (next) {

    const emailRegex = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;"
    if (this.email && emailRegex.test(this.email)) {
        return next();
    }
    next(new Error("Email is not valid"));
});


export const userMocksModel = model("userMocks", userMocksSchema);