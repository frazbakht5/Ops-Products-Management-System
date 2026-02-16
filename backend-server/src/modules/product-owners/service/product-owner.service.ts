import { ILike } from "typeorm";
import { AppDataSource } from "../../../database/data-source";
import { ProductOwner } from "../product-owner.entity";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../../../utils/errors";
import { IProductOwner } from "../product-owner.interface";

export class ProductOwnerService {
  private repo = AppDataSource.getRepository(ProductOwner);

  async create(data: IProductOwner) {
    try {
      const existing = await this.repo.findOne({ where: { email: data.email } });
      if (existing) {
        throw new ConflictError(`Product owner with email '${data.email}' already exists`);
      }
      const owner = this.repo.create(data);
      return await this.repo.save(owner);
    } catch (error) {
      if (error instanceof ConflictError) throw error;
      throw new InternalServerError("Failed to create product owner");
    }
  }

  async findAll(filters: {
    name?: string;
    email?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.name = ILike(`%${filters.name}%`);
      }

      if (filters.email) {
        whereConditions.email = filters.email;
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const sortBy = filters.sortBy || "name";
      const sortOrder = filters.sortOrder || "asc";

      const [items, total] = await this.repo.findAndCount({
        where: whereConditions,
        relations: ["products"],
        skip: (page - 1) * limit,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

      return { items, total };
    } catch (error) {
      throw new InternalServerError("Failed to fetch product owners");
    }
  }

  async findOneById(id: string) {
    try {
      const owner = await this.repo.findOne({
        where: { id },
        relations: ["products"],
      });
      if (!owner) {
        throw new NotFoundError(`Product owner with id '${id}' not found`);
      }
      return owner;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to fetch product owner");
    }
  }

  async update(id: string, data: Partial<IProductOwner>) {
    try {
      const owner = await this.findOneById(id);
      Object.assign(owner, data);
      return await this.repo.save(owner);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to update product owner");
    }
  }

  async delete(id: string) {
    try {
      await this.findOneById(id);
      await this.repo.delete(id);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to delete product owner");
    }
  }
}
