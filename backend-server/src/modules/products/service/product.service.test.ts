import { ProductService } from "./product.service";
import { NotFoundError, ConflictError } from "../../../utils/errors";

// Mock the AppDataSource before importing the service
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockOwnerService = {
  findOneById: jest.fn(),
};

jest.mock("../../../database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockRepository),
  },
}));

jest.mock("../../product-owners/service/product-owner.service", () => ({
  ProductOwnerService: jest.fn(() => mockOwnerService),
}));

describe("ProductService", () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
    jest.clearAllMocks();
    mockOwnerService.findOneById.mockResolvedValue({ id: "owner-1" });
  });

  describe("create", () => {
    const productData = {
      name: "Test Product",
      sku: "SKU-001",
      price: 99.99,
      inventory: 10,
      status: "ACTIVE" as const,
      ownerId: "owner-1",
    };

    it("should create a product successfully", async () => {
      const owner = { id: "owner-1", name: "Owner" };
      mockOwnerService.findOneById.mockResolvedValue(owner);
      const savedProduct = { id: "uuid-1", ...productData, owner };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(productData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { sku: productData.sku },
      });
      expect(mockOwnerService.findOneById).toHaveBeenCalledWith("owner-1");
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: productData.name,
        sku: productData.sku,
        price: productData.price,
        inventory: productData.inventory,
        status: productData.status,
        owner,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(savedProduct);
      expect(result).toEqual(savedProduct);
    });

    it("should throw ConflictError if SKU already exists", async () => {
      mockRepository.findOne.mockResolvedValue({ id: "existing", ...productData });

      await expect(service.create(productData)).rejects.toThrow(ConflictError);
      await expect(service.create(productData)).rejects.toThrow(
        `Product with SKU '${productData.sku}' already exists`
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should throw InternalServerError on unexpected failure", async () => {
      mockRepository.findOne.mockRejectedValue(new Error("DB down"));

      await expect(service.create(productData)).rejects.toThrow(
        "Failed to create product"
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated products with no filters", async () => {
      const products = [{ id: "1", name: "A" }, { id: "2", name: "B" }];
      mockRepository.findAndCount.mockResolvedValue([products, 2]);

      const result = await service.findAll({});

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ["owner"],
        skip: 0,
        take: 10,
        order: { name: "asc" },
      });
      expect(result).toEqual({ items: products, total: 2 });
    });

    it("should apply name filter with ILike", async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ name: "test" });

      const callArgs = mockRepository.findAndCount.mock.calls[0][0];
      expect(callArgs.where.name).toBeDefined();
    });

    it("should apply sku filter", async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ sku: "SKU-001" });

      const callArgs = mockRepository.findAndCount.mock.calls[0][0];
      expect(callArgs.where.sku).toBe("SKU-001");
    });

    it("should apply status filter", async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ status: "ACTIVE" });

      const callArgs = mockRepository.findAndCount.mock.calls[0][0];
      expect(callArgs.where.status).toBe("ACTIVE");
    });

    it("should apply pagination and sorting params", async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 2, limit: 5, sortBy: "price", sortOrder: "desc" });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ["owner"],
        skip: 5,
        take: 5,
        order: { price: "desc" },
      });
    });

    it("should throw InternalServerError on failure", async () => {
      mockRepository.findAndCount.mockRejectedValue(new Error("DB error"));

      await expect(service.findAll({})).rejects.toThrow(
        "Failed to fetch products"
      );
    });
  });

  describe("findOneById", () => {
    it("should return a product by id", async () => {
      const product = { id: "uuid-1", name: "Test" };
      mockRepository.findOne.mockResolvedValue(product);

      const result = await service.findOneById("uuid-1");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
        relations: ["owner"],
      });
      expect(result).toEqual(product);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById("non-existent")).rejects.toThrow(
        NotFoundError
      );
      await expect(service.findOneById("non-existent")).rejects.toThrow(
        "Product with id 'non-existent' not found"
      );
    });

    it("should throw InternalServerError on unexpected failure", async () => {
      mockRepository.findOne.mockRejectedValue(new Error("DB error"));

      await expect(service.findOneById("uuid-1")).rejects.toThrow(
        "Failed to fetch product"
      );
    });
  });

  describe("update", () => {
    it("should update and return the product", async () => {
      const existing = { id: "uuid-1", name: "Old", sku: "SKU-1", price: 10, inventory: 5, status: "ACTIVE" };
      const updated = { ...existing, name: "New" };
      mockRepository.findOne.mockResolvedValueOnce(existing);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update("uuid-1", { name: "New" });

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update("non-existent", { name: "X" })).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("delete", () => {
    it("should delete product successfully", async () => {
      const product = { id: "uuid-1", name: "Test" };
      mockRepository.findOne.mockResolvedValue(product);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete("uuid-1");

      expect(mockRepository.delete).toHaveBeenCalledWith("uuid-1");
    });

    it("should throw NotFoundError if product does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete("non-existent")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
