import { Request, Response } from "express";
import { ProductOwnerService } from "../service/product-owner.service";
import { handleError } from "../../../utils/handleError";
import {
  CreatedResponse,
  GetResponse,
  UpdatedResponse,
  DeletedResponse,
} from "../../../utils/responses";

const service = new ProductOwnerService();

export class ProductOwnerController {
  async create(req: Request, res: Response) {
    try {
      const owner = await service.create(req.body);
      const response = new CreatedResponse(owner);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to create product owner");
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const owners = await service.findAll(req.query as any);
      const response = new GetResponse(owners);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to fetch product owners");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const owner = await service.findOneById(req.params.id as string);
      const response = new GetResponse(owner);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to fetch product owner");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const owner = await service.update(req.params.id as string, req.body);
      const response = new UpdatedResponse(owner);
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to update product owner");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id as string);
      const response = new DeletedResponse();
      return res.status(response.statusCode).json(response);
    } catch (err: any) {
      return handleError(res, err, "Failed to delete product owner");
    }
  }

}
