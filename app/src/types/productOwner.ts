export interface ProductOwner {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface CreateProductOwnerPayload {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateProductOwnerPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ProductOwnerFilters {
  name?: string;
  email?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "email" | "phone";
  sortOrder?: "asc" | "desc";
}
