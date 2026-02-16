import { Router } from "express";
import { ProductController } from "./controller/product.controller";
import { validate } from "../../utils/validate";
import { idParamSchema } from "../../utils/schemas";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.schema";

const router = Router();
const controller = new ProductController();

router.post("/", validate(createProductSchema), controller.create);
router.get("/", validate(productQuerySchema, "query"), controller.getAll);
router.get("/:id", validate(idParamSchema, "params"), controller.getById);
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  controller.update
);
router.delete("/:id", validate(idParamSchema, "params"), controller.delete);

export default router;
