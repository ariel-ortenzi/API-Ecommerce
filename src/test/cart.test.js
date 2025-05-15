import request from "supertest";
import * as chai from "chai";

const expect = chai.expect;
const server = "http://localhost:8080";

describe("Test completo de Cart API", () => {
    let cartId;
    let productId;

    before(async () => {
        const res = await request(server)
            .get("/api/products")
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.payload).to.have.property("docs").that.is.an("array");
        if (res.body.payload.docs.length === 0) {
            throw new Error("No hay productos para testear");
        }
        productId = res.body.payload.docs[0]._id;
    });

    it("POST /api/carts/ - crear carrito vacío", async () => {
        const res = await request(server)
            .post("/api/carts/")
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        expect(res.body.payload).to.have.property("_id");
        expect(res.body.payload.products).to.be.an("array").that.is.empty;

        cartId = res.body.payload._id;
    });

    it("POST /api/carts/:cid/products/:pid - agregar producto al carrito", async () => {
        const res = await request(server)
            .post(`/api/carts/${cartId}/products/${productId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        expect(res.body.payload.products).to.be.an("array");
        const prodInCart = res.body.payload.products.find(
            (p) => p.product === productId || p.product._id === productId
        );
        expect(prodInCart).to.exist;
        expect(prodInCart.quantity).to.equal(1);
    });

    it("PUT /api/carts/:cid - actualizar productos del carrito", async () => {
        const newProducts = [{ product: productId, quantity: 5 }];
        const res = await request(server)
            .put(`/api/carts/${cartId}`)
            .send({ products: newProducts });

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        expect(res.body.payload.products).to.deep.include(newProducts[0]);
    });

    it("PUT /api/carts/:cid/products/:pid - actualizar cantidad producto en carrito", async () => {
        const newQuantity = 10;
        const res = await request(server)
            .put(`/api/carts/${cartId}/products/${productId}`)
            .send({ quantity: newQuantity });

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        const prodInCart = res.body.payload.products.find(
            (p) => p.product === productId || p.product._id === productId
        );
        expect(prodInCart).to.exist;
        expect(prodInCart.quantity).to.equal(newQuantity);
    });

    it("DELETE /api/carts/:cid/products/:pid - eliminar producto del carrito", async () => {
        const res = await request(server)
            .delete(`/api/carts/${cartId}/products/${productId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        const prodInCart = res.body.payload.products.find(
            (p) => p.product === productId || p.product._id === productId
        );
        expect(prodInCart).to.not.exist;
    });

    it("GET /api/carts/:cid - obtener carrito completo", async () => {
        const res = await request(server)
            .get(`/api/carts/${cartId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        expect(res.body.payload).to.have.property("_id", cartId);
    });

    it("DELETE /api/carts/:cid - eliminar carrito completo", async () => {
        const res = await request(server)
            .delete(`/api/carts/${cartId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ok");
        expect(res.body.payload).to.have.property("_id", cartId);
    });


    // Tests para manejo de errores
    it("POST /api/carts/:cid/products/:pid - producto no existente", async () => {
        const fakeProductId = "64e2a1b9f100000000000000";
        const res = await request(server)
            .post(`/api/carts/${cartId}/products/${fakeProductId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("error");
        expect(res.body.message).to.include("Product ID");
    });

    it("POST /api/carts/:cid/products/:pid - carrito no existente", async () => {
        const fakeCartId = "64e2a1b9f100000000000001";
        const res = await request(server)
            .post(`/api/carts/${fakeCartId}/products/${productId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("error");
        expect(res.body.message).to.include("Cart ID");
    });

    it("PUT /api/carts/:cid/products/:pid - actualizar cantidad con carrito no existente", async () => {
        const fakeCartId = "64e2a1b9f100000000000002";
        const res = await request(server)
            .put(`/api/carts/${fakeCartId}/products/${productId}`)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("error");
        expect(res.body.message).to.include("Cart id");
    });

    it("PUT /api/carts/:cid/products/:pid - actualizar cantidad con producto no existente", async () => {
        const fakeProductId = "64e2a1b9f100000000000003";
        const res = await request(server)
            .put(`/api/carts/${cartId}/products/${fakeProductId}`)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("error");
        expect(res.body.message).to.include("Product ID");
    });

    it("DELETE /api/carts/:cid/products/:pid - eliminar producto con ids inválidos", async () => {
        const fakeCartId = "64e2a1b9f100000000000004";
        const fakeProductId = "64e2a1b9f100000000000005";
        const res = await request(server)
            .delete(`/api/carts/${fakeCartId}/products/${fakeProductId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("error");
    });

    it("DELETE /api/carts/:cid - eliminar productos en carrito con id inválido", async () => {
        const fakeCartId = "64e2a1b9f100000000000006";
        const res = await request(server)
            .delete(`/api/carts/${fakeCartId}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("error");
    });
});
