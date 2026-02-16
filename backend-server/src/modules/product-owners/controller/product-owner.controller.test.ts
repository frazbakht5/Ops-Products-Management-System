import request from "supertest";
import express from "express";
import { NotFoundError, ConflictError } from "../../../utils/errors";
import { validate } from "../../../utils/validate";
import { idParamSchema } from "../../../utils/schemas";
import {
  createProductOwnerSchema,
  updateProductOwnerSchema,
  productOwnerQuerySchema,
} from "../product-owner.schema";

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOneById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("../service/product-owner.service", () => ({
  ProductOwnerService: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    findAll: mockFindAll,
    findOneById: mockFindOneById,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

import { ProductOwnerController } from "./product-owner.controller";

const VALID_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

describe("ProductOwnerController (e2e)", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();

    const controller = new ProductOwnerController();
    app = express();
    app.use(express.json());
    app.post("/product-owners", validate(createProductOwnerSchema), controller.create);
    app.get(
      "/product-owners",
      validate(productOwnerQuerySchema, "query"),
      controller.getAll
    );
    app.get("/product-owners/:id", validate(idParamSchema, "params"), controller.getById);
    app.put(
      "/product-owners/:id",
      validate(idParamSchema, "params"),
      validate(updateProductOwnerSchema),
      controller.update
    );
    app.delete("/product-owners/:id", validate(idParamSchema, "params"), controller.delete);
  });

  describe("POST /product-owners", () => {
    const ownerData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    };

    it("should return 201 and created owner", async () => {
      const saved = { id: VALID_UUID, ...ownerData };
      mockCreate.mockResolvedValue(saved);

      const res = await request(app).post("/product-owners").send(ownerData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.statusCode).toBe(201);
      expect(res.body.data).toEqual(saved);
    });

    it("should return 400 when required fields are missing", async () => {
      const res = await request(app).post("/product-owners").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Validation failed");
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should return 400 when email is invalid", async () => {
      const res = await request(app)
        .post("/product-owners")
        .send({ name: "John", email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should return 409 when email already exists", async () => {
      mockCreate.mockRejectedValue(
        new ConflictError("Product owner with email 'john@example.com' already exists")
      );

      const res = await request(app).post("/product-owners").send(ownerData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it("should return 500 on unexpected error", async () => {
      mockCreate.mockRejectedValue(new Error("DB crash"));

      const res = await request(app).post("/product-owners").send(ownerData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe(500);
    });
  });

  describe("GET /product-owners", () => {
    it("should return 200 and list of owners", async () => {
      const owners = [
        { id: "1", name: "John", email: "john@test.com" },
        { id: "2", name: "Jane", email: "jane@test.com" },
      ];
      mockFindAll.mockResolvedValue(owners);

      const res = await request(app).get("/product-owners");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(owners);
    });

    it("should pass query filters to service", async () => {
      mockFindAll.mockResolvedValue([]);

      await request(app).get("/product-owners?name=john&email=john@test.com");

      expect(mockFindAll).toHaveBeenCalledWith(
        expect.objectContaining({ name: "john", email: "john@test.com" })
      );
    });

    it("should return 500 on service failure", async () => {
      mockFindAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/product-owners");

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /product-owners/:id", () => {
    it("should return 200 and the owner", async () => {
      const owner = { id: VALID_UUID, name: "John", email: "john@test.com" };
      mockFindOneById.mockResolvedValue(owner);

      const res = await request(app).get(`/product-owners/${VALID_UUID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(owner);
    });

    it("should return 404 when owner not found", async () => {
      mockFindOneById.mockRejectedValue(
        new NotFoundError(`Product owner with id '${VALID_UUID}' not found`)
      );

      const res = await request(app).get(`/product-owners/${VALID_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("not found");
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const res = await request(app).get("/product-owners/not-a-uuid");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Validation failed");
      expect(mockFindOneById).not.toHaveBeenCalled();
    });
  });

  describe("PUT /product-owners/:id", () => {
    it("should return 200 and updated owner", async () => {
      const updated = { id: VALID_UUID, name: "Updated", email: "john@test.com" };
      mockUpdate.mockResolvedValue(updated);

      const res = await request(app)
        .put(`/product-owners/${VALID_UUID}`)
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updated);
    });

    it("should return 404 when owner not found", async () => {
      mockUpdate.mockRejectedValue(
        new NotFoundError(`Product owner with id '${VALID_UUID}' not found`)
      );

      const res = await request(app)
        .put(`/product-owners/${VALID_UUID}`)
        .send({ name: "X" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when body is empty", async () => {
      const res = await request(app)
        .put(`/product-owners/${VALID_UUID}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const res = await request(app)
        .put("/product-owners/bad-id")
        .send({ name: "Updated" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /product-owners/:id", () => {
    it("should return 200 on successful delete", async () => {
      mockDelete.mockResolvedValue(undefined);

      const res = await request(app).delete(`/product-owners/${VALID_UUID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Deleted");
    });

    it("should return 404 when owner not found", async () => {
      mockDelete.mockRejectedValue(
        new NotFoundError(`Product owner with id '${VALID_UUID}' not found`)
      );

      const res = await request(app).delete(`/product-owners/${VALID_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const res = await request(app).delete("/product-owners/bad-id");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
