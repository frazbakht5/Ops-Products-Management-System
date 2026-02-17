import { ILike, FindOperator } from "typeorm";
import { AppDataSource } from "../../../database/data-source";
import { Product } from "../product.entity";
import { IProduct } from "../product.interface";
import { ProductOwnerService } from "../../product-owners/service/product-owner.service";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../../../utils/errors";
import { ProductFilters } from "../product.types";
import { logger } from "../../../logger";

export class ProductService {
  private repo = AppDataSource.getRepository(Product);
  private ownerService = new ProductOwnerService();

  async create(data: IProduct) {
    try {
      const existing = await this.repo.findOne({ where: { sku: data.sku } });
      if (existing) {
        throw new ConflictError(
          `Product with SKU '${data.sku}' already exists`,
        );
      }
      const { ownerId, ...rest } = data as IProduct & { ownerId: string };
      const owner = await this.ownerService.findOneById(ownerId);
      const product = this.repo.create({ ...rest, owner });
      return await this.repo.save(product);
    } catch (error: any) {
      logger.info("Error in ProductService.create: " + error.message);
      if (error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Failed to create product");
    }
  }

  private getWhereConditionsByFilters(filters: ProductFilters) {
    const whereConditions: any = {};

    if (filters.name) {
      whereConditions.name = ILike(`%${filters.name}%`);
    }

    if (filters.sku) {
      whereConditions.sku = filters.sku;
    }

    if (filters.ownerName) {
      whereConditions.owner = {
        name: ILike(`%${filters.ownerName}%`),
      };
    }

    if (filters.status) {
      whereConditions.status = filters.status;
    }
    return whereConditions;
  }
  async findAll(filters: ProductFilters) {
    try {
      const whereConditions: any = this.getWhereConditionsByFilters(filters);

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const sortBy = filters.sortBy || "name";
      const sortOrder = filters.sortOrder || "asc";

      const [items, total] = await this.repo.findAndCount({
        where: whereConditions,
        relations: ["owner"],
        skip: (page - 1) * limit,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

      return { items, total };
    } catch (error: any) {
      logger.info("Error in ProductService.findAll: " + error.message);
      throw new InternalServerError("Failed to fetch products");
    }
  }

  async findOneById(id: string) {
    try {
      const product = await this.repo.findOne({
        where: { id },
        relations: ["owner"],
      });
      if (!product) {
        throw new NotFoundError(`Product with id '${id}' not found`);
      }
      return product;
    } catch (error: any) {
      logger.info("Error in ProductService.findOneById: " + error.message);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to fetch product");
    }
  }

  async findByOwnerId(ownerId: string) {
    try {
      await this.ownerService.findOneById(ownerId);
      return await this.repo.find({
        where: { owner: { id: ownerId } },
        relations: ["owner"],
        order: { name: "asc" },
      });
    } catch (error: any) {
      logger.info("Error in ProductService.findByOwnerId: " + error.message);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to fetch products for owner");
    }
  }

  async update(id: string, data: Partial<IProduct>) {
    try {
      const product = await this.findOneById(id);
      const { ownerId, ...rest } = data as Partial<IProduct> & {
        ownerId?: string;
      };
      Object.assign(product, rest);

      if (ownerId) {
        const owner = await this.ownerService.findOneById(ownerId);
        product.owner = owner;
      }
      return await this.repo.save(product);
    } catch (error: any) {
      logger.info("Error in ProductService.update: " + error.message);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to update product");
    }
  }

  async delete(id: string) {
    try {
      await this.findOneById(id);
      await this.repo.delete(id);
    } catch (error: any) {
      logger.info("Error in ProductService.delete: " + error.message);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to delete product");
    }
  }
}
