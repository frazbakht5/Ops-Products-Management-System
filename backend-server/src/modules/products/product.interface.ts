import { ProductOwner } from "../product-owners/product-owner.entity";

export interface ProductAttributes {
  id?: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: "ACTIVE" | "INACTIVE";
  owner?: ProductOwner;
}
