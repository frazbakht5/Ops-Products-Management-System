import { Router } from "express";
import { ProductOwnerController } from "./controller/product-owner.controller";
import { validate } from "../../utils/validate";
import { idParamSchema } from "../../utils/schemas";
import {
  createProductOwnerSchema,
  updateProductOwnerSchema,
  productOwnerQuerySchema,
} from "./product-owner.schema";

const router = Router();
const controller = new ProductOwnerController();

router.post("/", validate(createProductOwnerSchema), controller.create);
router.get(
  "/",
  validate(productOwnerQuerySchema, "query"),
  controller.getAll
);
router.get("/:id", validate(idParamSchema, "params"), controller.getById);
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateProductOwnerSchema),
  controller.update
);
router.delete("/:id", validate(idParamSchema, "params"), controller.delete);

export default router;
