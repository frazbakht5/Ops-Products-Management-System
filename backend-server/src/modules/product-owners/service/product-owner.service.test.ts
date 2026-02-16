import { ProductOwnerService } from "./product-owner.service";
import { NotFoundError, ConflictError } from "../../../utils/errors";

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../../database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockRepository),
  },
}));

describe("ProductOwnerService", () => {
  let service: ProductOwnerService;

  beforeEach(() => {
    service = new ProductOwnerService();
    jest.clearAllMocks();
  });

  describe("create", () => {
    const ownerData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    };

    it("should create a product owner successfully", async () => {
      const saved = { id: "uuid-1", ...ownerData };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(saved);
      mockRepository.save.mockResolvedValue(saved);

      const result = await service.create(ownerData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: ownerData.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(ownerData);
      expect(mockRepository.save).toHaveBeenCalledWith(saved);
      expect(result).toEqual(saved);
    });

    it("should throw ConflictError if email already exists", async () => {
      mockRepository.findOne.mockResolvedValue({ id: "existing", ...ownerData });

      await expect(service.create(ownerData)).rejects.toThrow(ConflictError);
      await expect(service.create(ownerData)).rejects.toThrow(
        `Product owner with email '${ownerData.email}' already exists`
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should throw InternalServerError on unexpected failure", async () => {
      mockRepository.findOne.mockRejectedValue(new Error("DB down"));

      await expect(service.create(ownerData)).rejects.toThrow(
        "Failed to create product owner"
      );
    });
  });

  describe("findAll", () => {
    it("should return all product owners with no filters", async () => {
      const owners = [{ id: "1", name: "A" }, { id: "2", name: "B" }];
      mockRepository.find.mockResolvedValue(owners);

      const result = await service.findAll({});

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ["products"],
      });
      expect(result).toEqual(owners);
    });

    it("should apply name filter with ILike", async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findAll({ name: "john" });

      const callArgs = mockRepository.find.mock.calls[0][0];
      expect(callArgs.where.name).toBeDefined();
    });

    it("should apply email filter", async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findAll({ email: "john@example.com" });

      const callArgs = mockRepository.find.mock.calls[0][0];
      expect(callArgs.where.email).toBe("john@example.com");
    });

    it("should throw InternalServerError on failure", async () => {
      mockRepository.find.mockRejectedValue(new Error("DB error"));

      await expect(service.findAll({})).rejects.toThrow(
        "Failed to fetch product owners"
      );
    });
  });

  describe("findOneById", () => {
    it("should return a product owner by id", async () => {
      const owner = { id: "uuid-1", name: "John" };
      mockRepository.findOne.mockResolvedValue(owner);

      const result = await service.findOneById("uuid-1");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
        relations: ["products"],
      });
      expect(result).toEqual(owner);
    });

    it("should throw NotFoundError if owner does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById("non-existent")).rejects.toThrow(
        NotFoundError
      );
      await expect(service.findOneById("non-existent")).rejects.toThrow(
        "Product owner with id 'non-existent' not found"
      );
    });

    it("should throw InternalServerError on unexpected failure", async () => {
      mockRepository.findOne.mockRejectedValue(new Error("DB error"));

      await expect(service.findOneById("uuid-1")).rejects.toThrow(
        "Failed to fetch product owner"
      );
    });
  });

  describe("update", () => {
    it("should update and return the product owner", async () => {
      const existing = { id: "uuid-1", name: "Old", email: "old@test.com" };
      const updated = { ...existing, name: "New" };
      mockRepository.findOne.mockResolvedValueOnce(existing);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update("uuid-1", { name: "New" });

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });

    it("should throw NotFoundError if owner does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update("non-existent", { name: "X" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("delete", () => {
    it("should delete a product owner successfully", async () => {
      const owner = { id: "uuid-1", name: "John" };
      mockRepository.findOne.mockResolvedValue(owner);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete("uuid-1");

      expect(mockRepository.delete).toHaveBeenCalledWith("uuid-1");
    });

    it("should throw NotFoundError if owner does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete("non-existent")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
