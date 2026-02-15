import { Application } from "express";
import productRoutes from "./products/product.routes";
import productOwnerRoutes from "./product-owners/product-owner.routes";

export const registerRoutes = (app: Application): void => {
  app.use("/products", productRoutes);
  app.use("/product-owners", productOwnerRoutes);
};
