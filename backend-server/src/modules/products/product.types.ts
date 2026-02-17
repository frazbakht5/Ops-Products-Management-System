export type ProductFilters = {
  name?: string;
  sku?: string;
  ownerName?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
