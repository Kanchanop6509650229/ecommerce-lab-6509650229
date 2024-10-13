const request = require("supertest");
const app = require("../app");
describe("GET /products", () => {
  it("should return the all products(Currently 2 products)", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBe(2);

    expect(res.body[0]).toHaveProperty("id", 1);
    expect(res.body[0]).toHaveProperty("name", "Laptop");
    expect(res.body[0]).toHaveProperty("price", 1000);
    expect(res.body[0]).toHaveProperty("stock", 5);

    expect(res.body[1]).toHaveProperty("id", 2);
    expect(res.body[1]).toHaveProperty("name", "Smartphone");
    expect(res.body[1]).toHaveProperty("price", 600);
    expect(res.body[1]).toHaveProperty("stock", 10);
  });
});

describe("GET /products/:id", () => {
  it("should return a product by ID", async () => {
    const res = await request(app).get("/products/1");
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name", "Laptop");
    expect(res.body).toHaveProperty("price", 1000);
    expect(res.body).toHaveProperty("stock", 5);
  });
  it("should return 404 if product not found", async () => {
    const res = await request(app).get("/products/3");
    expect(res.statusCode).toBe(404);

    expect(res.body.message).toEqual("Product not found");
  });
});

describe("POST /products", () => {
  it("should add a new product", async () => {
    const newProductInput = {
      name: "weed",
      price: 1290,
      stock: 200,
    };
    const res = await request(app).post("/products").send(newProductInput);

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toEqual(3);
    expect(res.body.name).toEqual(newProductInput.name);
    expect(res.body.price).toEqual(newProductInput.price);
    expect(res.body.stock).toEqual(newProductInput.stock);

    const res2 = await request(app).get("/products");
    expect(res2.statusCode).toBe(200);

    expect(res2.body.length).toBe(3);
  });
});

describe("PUT /products/:id", () => {
  it("should update an existing product", async () => {
    const editExistingProduct = {
      name: "cocaine",
      price: 1120,
    };
    const editExistingProduct2 = {
      stock: 500,
    };
    const res = await request(app).put("/products/1").send(editExistingProduct);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual(editExistingProduct.name);
    expect(res.body.price).toEqual(editExistingProduct.price);
    expect(res.body.stock).toEqual(5);

    const res2 = await request(app)
      .put("/products/1")
      .send(editExistingProduct2);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.id).toEqual(1);
    expect(res2.body.name).toEqual(editExistingProduct.name);
    expect(res2.body.price).toEqual(editExistingProduct.price);
    expect(res2.body.stock).toEqual(editExistingProduct2.stock);
  });
  it("should return 404 if product not found", async () => {
    const editExistingProduct = {
      name: "cocaine",
      price: 1120,
      stock: 50,
    };
    const res = await request(app).put("/products/0").send(editExistingProduct);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual("Product not found");
  });
});

describe("DELETE /products/:id", () => {
  it("should delete a product", async () => {
    const res = await request(app).delete("/products/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual("Product deleted");

    const res2 = await request(app).get("/products");
    expect(res2.statusCode).toBe(200);

    expect(res2.body.length).toBe(2);
  });
  it("should return 404 if product not found", async () => {
    const res = await request(app).delete("/products/1");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual("Product not found");

    const res2 = await request(app).get("/products");
    expect(res2.statusCode).toBe(200);

    expect(res2.body.length).toBe(2);
  });
});
