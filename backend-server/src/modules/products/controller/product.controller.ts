import { Request, Response } from "express";
import { ProductService } from "../service/product.service";
import { handleError } from "../../../utils/handleError";
import {
  CreatedResponse,
  GetResponse,
  UpdatedResponse,
  DeletedResponse,
} from "../../../utils/responses";

const service = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    try {
      const product = await service.create(req.body);
      const response = new CreatedResponse(product);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to create product");
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, sortBy, sortOrder, ...filters } = req.query as any;
      const result = await service.findAll({
        ...filters,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy,
        sortOrder,
      });
      const response = new GetResponse(result);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to fetch products");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await service.findOneById(req.params.id as string);
      const response = new GetResponse(product);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to fetch product");
    }
  }

  async getByOwner(req: Request, res: Response) {
    try {
      const products = await service.findByOwnerId(req.params.ownerId as string);
      const response = new GetResponse(products);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to fetch products for owner");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const product = await service.update(req.params.id as string, req.body);
      const response = new UpdatedResponse(product);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to update product");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id as string);
      const response = new DeletedResponse();
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to delete product");
    }
  }

}
