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

/**
 * @swagger
 * tags:
 *   - name: Product Owners
 *     description: Product owner management
 */

/**
 * @swagger
 * /product-owners:
 *   post:
 *     summary: Create a new product owner
 *     tags: [Product Owners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductOwner'
 *     responses:
 *       201:
 *         description: Product owner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductOwner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Product owner with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validate(createProductOwnerSchema), controller.create);

/**
 * @swagger
 * /product-owners:
 *   get:
 *     summary: List all product owners
 *     tags: [Product Owners]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (partial match)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by exact email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, phone]
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Paginated list of product owners
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ProductOwner'
 *                         total:
 *                           type: integer
 */
router.get(
  "/",
  validate(productOwnerQuerySchema, "query"),
  controller.getAll
);

/**
 * @swagger
 * /product-owners/{id}:
 *   get:
 *     summary: Get a product owner by ID
 *     tags: [Product Owners]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product owner found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductOwner'
 *       404:
 *         description: Product owner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", validate(idParamSchema, "params"), controller.getById);

/**
 * @swagger
 * /product-owners/{id}:
 *   put:
 *     summary: Update a product owner
 *     tags: [Product Owners]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductOwner'
 *     responses:
 *       200:
 *         description: Product owner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductOwner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product owner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateProductOwnerSchema),
  controller.update
);

/**
 * @swagger
 * /product-owners/{id}:
 *   delete:
 *     summary: Delete a product owner
 *     tags: [Product Owners]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product owner deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Product owner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", validate(idParamSchema, "params"), controller.delete);

export default router;
