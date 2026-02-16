import { ILike } from "typeorm";
import { AppDataSource } from "../../../database/data-source";
import { Product } from "../product.entity";
import { IProduct } from "../product.interface";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../../../utils/errors";

export class ProductService {
  private repo = AppDataSource.getRepository(Product);

  async create(data: IProduct) {
    try {
      const existing = await this.repo.findOne({ where: { sku: data.sku } });
      if (existing) {
        throw new ConflictError(`Product with SKU '${data.sku}' already exists`);
      }
      const product = this.repo.create(data);
      return await this.repo.save(product);
    } catch (error) {
      if (error instanceof ConflictError) throw error;
      throw new InternalServerError("Failed to create product");
    }
  }

  async findAll(filters: Partial<IProduct>) {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.name = ILike(`%${filters.name}%`);
      }

      if (filters.sku) {
        whereConditions.sku = filters.sku;
      }

      if (filters.status) {
        whereConditions.status = filters.status;
      }

      if (filters.owner) {
        whereConditions.owner = { id: filters.owner.id };
      }

      return await this.repo.find({
        where: whereConditions,
        relations: ["owner"],
      });
    } catch (error) {
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
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to fetch product");
    }
  }

  async update(id: string, data: Partial<IProduct>) {
    try {
      const product = await this.findOneById(id);
      Object.assign(product, data);
      return await this.repo.save(product);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to update product");
    }
  }

  async delete(id: string) {
    try {
      await this.findOneById(id);
      await this.repo.delete(id);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to delete product");
    }
  }
}
