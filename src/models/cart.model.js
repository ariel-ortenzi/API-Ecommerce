import { mongoose } from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
    type: Array,
    // default: [ { product: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, quantity: Number } ],
    },
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);