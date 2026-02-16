import request from "supertest";
import express from "express";
import { NotFoundError, ConflictError } from "../../../utils/errors";
import { validate } from "../../../utils/validate";
import { idParamSchema } from "../../../utils/schemas";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../product.schema";

// Must set up mock before importing controller
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOneById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("../service/product.service", () => ({
  ProductService: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    findAll: mockFindAll,
    findOneById: mockFindOneById,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

import { ProductController } from "./product.controller";

const VALID_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

describe("ProductController (e2e)", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();

    const controller = new ProductController();
    app = express();
    app.use(express.json());
    app.post("/products", validate(createProductSchema), controller.create);
    app.get("/products", validate(productQuerySchema, "query"), controller.getAll);
    app.get("/products/:id", validate(idParamSchema, "params"), controller.getById);
    app.put(
      "/products/:id",
      validate(idParamSchema, "params"),
      validate(updateProductSchema),
      controller.update
    );
    app.delete("/products/:id", validate(idParamSchema, "params"), controller.delete);
  });

  describe("POST /products", () => {
    const productData = {
      name: "Test Product",
      sku: "SKU-001",
      price: 99.99,
      inventory: 10,
      status: "ACTIVE",
    };

    it("should return 201 and created product", async () => {
      const saved = { id: VALID_UUID, ...productData };
      mockCreate.mockResolvedValue(saved);

      const res = await request(app).post("/products").send(productData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.statusCode).toBe(201);
      expect(res.body.data).toEqual(saved);
    });

    it("should return 400 when required fields are missing", async () => {
      const res = await request(app).post("/products").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Validation failed");
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should return 400 when price is negative", async () => {
      const res = await request(app)
        .post("/products")
        .send({ ...productData, price: -10 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should return 400 when status is invalid", async () => {
      const res = await request(app)
        .post("/products")
        .send({ ...productData, status: "UNKNOWN" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should return 409 when SKU already exists", async () => {
      mockCreate.mockRejectedValue(
        new ConflictError("Product with SKU 'SKU-001' already exists")
      );

      const res = await request(app).post("/products").send(productData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it("should return 500 on unexpected error", async () => {
      mockCreate.mockRejectedValue(new Error("DB crash"));

      const res = await request(app).post("/products").send(productData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe(500);
    });
  });

  describe("GET /products", () => {
    it("should return 200 and list of products", async () => {
      const products = [
        { id: "1", name: "A", sku: "SKU-A" },
        { id: "2", name: "B", sku: "SKU-B" },
      ];
      mockFindAll.mockResolvedValue(products);

      const res = await request(app).get("/products");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(products);
    });

    it("should pass query filters to service", async () => {
      mockFindAll.mockResolvedValue([]);

      await request(app).get("/products?name=test&status=ACTIVE");

      expect(mockFindAll).toHaveBeenCalledWith(
        expect.objectContaining({ name: "test", status: "ACTIVE" })
      );
    });

    it("should return 500 on service failure", async () => {
      mockFindAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/products");

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /products/:id", () => {
    it("should return 200 and the product", async () => {
      const product = { id: VALID_UUID, name: "Test", sku: "SKU-1" };
      mockFindOneById.mockResolvedValue(product);

      const res = await request(app).get(`/products/${VALID_UUID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(product);
    });

    it("should return 404 when product not found", async () => {
      mockFindOneById.mockRejectedValue(
        new NotFoundError(`Product with id '${VALID_UUID}' not found`)
      );

      const res = await request(app).get(`/products/${VALID_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("not found");
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const res = await request(app).get("/products/not-a-uuid");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Validation failed");
      expect(mockFindOneById).not.toHaveBeenCalled();
    });
  });

  describe("PUT /products/:id", () => {
    it("should return 200 and updated product", async () => {
      const updated = { id: VALID_UUID, name: "Updated", sku: "SKU-1" };
      mockUpdate.mockResolvedValue(updated);

      const res = await request(app)
        .put(`/products/${VALID_UUID}`)
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updated);
    });

    it("should return 404 when product not found", async () => {
      mockUpdate.mockRejectedValue(
        new NotFoundError(`Product with id '${VALID_UUID}' not found`)
      );

      const res = await request(app)
        .put(`/products/${VALID_UUID}`)
        .send({ name: "X" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when body is empty", async () => {
      const res = await request(app)
        .put(`/products/${VALID_UUID}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const res = await request(app)
        .put("/products/bad-id")
        .send({ name: "Updated" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /products/:id", () => {
    it("should return 200 on successful delete", async () => {
      mockDelete.mockResolvedValue(undefined);

      const res = await request(app).delete(`/products/${VALID_UUID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Deleted");
    });

    it("should return 404 when product not found", async () => {
      mockDelete.mockRejectedValue(
        new NotFoundError(`Product with id '${VALID_UUID}' not found`)
      );

      const res = await request(app).delete(`/products/${VALID_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const res = await request(app).delete("/products/bad-id");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
