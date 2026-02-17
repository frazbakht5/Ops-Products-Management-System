export type ProductOwnerFilters = {
    name?: string;
    email?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }