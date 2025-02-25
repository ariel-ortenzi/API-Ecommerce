import { ticketPurchasedModel } from "../../models/ticket.model.js";

class TicketPurchasedService {
    async getAll() {
        return ticketPurchasedModel.find();
    }

    async getById({ id }) {
        return ticketPurchasedModel.findById(id);
    }

    async create({ ticket }) {
        return ticketPurchasedModel.create(ticket);
    }

    async update({ id, ticket }) {
        return ticketPurchasedModel.findByIdAndUpdate(id, ticket, { new: true });
    }

    async getTicketNumber() {
        return Number(Date.now() + Math.floor(Math.random() * 10000 + 1));
    }
}

export const ticketPurchasedDao = new TicketPurchasedService();