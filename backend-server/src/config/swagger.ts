import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ops Products Management API",
      version: "1.0.0",
      description: "API documentation for the Ops Products Management System",
    },
    components: {
      schemas: {
        ProductOwner: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
            name: { type: "string", example: "Alice Johnson" },
            email: { type: "string", format: "email", example: "alice.johnson@example.com" },
            phone: { type: "string", example: "+1-555-0101", nullable: true },
            products: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "f1e2d3c4-b5a6-7890-abcd-ef1234567890" },
            name: { type: "string", example: "Widget Pro" },
            sku: { type: "string", example: "WGT-PRO-001" },
            price: { type: "number", format: "double", example: 29.99 },
            inventory: { type: "integer", example: 150 },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
            image: {
              type: "string",
              nullable: true,
              description: "Base64 encoded image data",
            },
            imageMimeType: {
              type: "string",
              nullable: true,
              description: "MIME type describing the stored image",
              example: "image/png",
            },
            owner: { $ref: "#/components/schemas/ProductOwner" },
          },
        },
        CreateProductOwner: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255, example: "Alice Johnson" },
            email: { type: "string", format: "email", example: "alice.johnson@example.com" },
            phone: { type: "string", maxLength: 20, example: "+1-555-0101", nullable: true },
          },
        },
        UpdateProductOwner: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255, example: "Alice Johnson" },
            email: { type: "string", format: "email", example: "alice.johnson@example.com" },
            phone: { type: "string", maxLength: 20, example: "+1-555-0101", nullable: true },
          },
        },
        CreateProduct: {
          type: "object",
          required: ["name", "sku", "price", "ownerId"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255, example: "Widget Pro" },
            sku: { type: "string", minLength: 1, maxLength: 100, example: "WGT-PRO-001" },
            price: { type: "number", minimum: 0, example: 29.99 },
            inventory: { type: "integer", minimum: 0, default: 0, example: 150 },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE", example: "ACTIVE" },
            ownerId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
            image: {
              type: "string",
              description: "Base64 encoded image data (max 5MB)",
            },
            imageMimeType: {
              type: "string",
              description: "MIME type for the provided image (e.g. image/png)",
            },
          },
        },
        UpdateProduct: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255, example: "Widget Pro" },
            sku: { type: "string", minLength: 1, maxLength: 100, example: "WGT-PRO-001" },
            price: { type: "number", minimum: 0, example: 29.99 },
            inventory: { type: "integer", minimum: 0, example: 150 },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
            ownerId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
            image: {
              type: "string",
              nullable: true,
              description: "Base64 encoded image data. Send null to remove the existing image.",
            },
            imageMimeType: {
              type: "string",
              nullable: true,
              description: "MIME type for the provided image. Send null alongside image=null to clear the stored value.",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            statusCode: { type: "integer", example: 200 },
            message: { type: "string", example: "OK" },
            data: { type: "object" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            statusCode: { type: "integer", example: 200 },
            message: { type: "string", example: "OK" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { type: "object" } },
                total: { type: "integer", example: 50 },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "integer", example: 400 },
            message: { type: "string", example: "Validation failed" },
          },
        },
      },
      parameters: {
        IdParam: {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Resource UUID",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../modules/**/*.routes.{ts,js}"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
