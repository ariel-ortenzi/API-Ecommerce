import { Schema, model } from "mongoose";

const ticketPurchasedSchema = new Schema({
    number: { type: Number, required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "product", required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
});

// Middleware de mongoose
ticketPurchasedSchema.pre("find", function () {
    this.populate("user").populate("products.product");
});

ticketPurchasedSchema.pre("findOne", function () {
    this.populate("user").populate("products.product");
});

export const ticketPurchasedModel = model("TicketPurchased", ticketPurchasedSchema);