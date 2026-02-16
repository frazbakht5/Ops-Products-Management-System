export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: "ACTIVE" | "INACTIVE";
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  price: number;
  inventory?: number;
  status?: "ACTIVE" | "INACTIVE";
  ownerId: string;
}

export interface UpdateProductPayload {
  name?: string;
  sku?: string;
  price?: number;
  inventory?: number;
  status?: "ACTIVE" | "INACTIVE";
  ownerId?: string | null;
}

export interface ProductFilters {
  name?: string;
  sku?: string;
  ownerName?: string;
  status?: "ACTIVE" | "INACTIVE";
  page?: number;
  limit?: number;
  sortBy?: "name" | "sku" | "price" | "inventory" | "status";
  sortOrder?: "asc" | "desc";
}
