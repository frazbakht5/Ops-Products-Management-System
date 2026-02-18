import { Request, Response } from "express";
import { ProductOwnerService } from "../service/product-owner.service";
import { handleError } from "../../../utils/commonFunctions";
import {
  CreatedResponse,
  GetResponse,
  UpdatedResponse,
  DeletedResponse,
} from "../../../utils/responses";
import { logger } from "../../../logger";

const service = new ProductOwnerService();

export class ProductOwnerController {
  async create(req: Request, res: Response) {
    logger.silly("Creating product owner with data: " + JSON.stringify(req.body));
    try {
      const owner = await service.create(req.body);
      const response = new CreatedResponse(owner);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      logger.info("Error creating product owner: " + err.message);
      return handleError(res, err, "Failed to create product owner");
    }
  }

  async getAll(req: Request, res: Response) {
    logger.silly(
      "Fetching all product owners with query: " + JSON.stringify(req.query),
    );
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
      logger.info("Error fetching product owners: " + err.message);
      return handleError(res, err, "Failed to fetch product owners");
    }
  }

  async getById(req: Request, res: Response) {
    logger.silly("Fetching product owner by ID: " + req.params.id);
    try {
      const owner = await service.findOneById(req.params.id as string);
      const response = new GetResponse(owner);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      logger.info("Error fetching product owner: " + err.message);
      return handleError(res, err, "Failed to fetch product owner");
    }
  }

  async update(req: Request, res: Response) {
    logger.silly(
      "Updating product owner ID: " + req.params.id + " with data: " + JSON.stringify(req.body),
    );
    try {
      const owner = await service.update(req.params.id as string, req.body);
      const response = new UpdatedResponse(owner);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      logger.info("Error updating product owner: " + err.message);
      return handleError(res, err, "Failed to update product owner");
    }
  }

  async delete(req: Request, res: Response) {
    logger.silly("Deleting product owner ID: " + req.params.id);
    try {
      await service.delete(req.params.id as string);
      const response = new DeletedResponse();
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      logger.info("Error deleting product owner: " + err.message);
      return handleError(res, err, "Failed to delete product owner");
    }
  }

}
