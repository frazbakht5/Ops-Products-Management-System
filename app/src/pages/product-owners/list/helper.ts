import type { Column } from "../../../components/common/DataTable";
import type { FilterConfig } from "../../../components/common/FilterBar";
import type { ProductOwner } from "../../../types/productOwner";

export const DEFAULTS = {
  name: "",
  email: "",
  page: 1,
  limit: 10,
  sortBy: "name",
  sortOrder: "asc",
} as const;

export type ProductOwnerListParams = typeof DEFAULTS;

export const filterConfigs: FilterConfig[] = [
  {
    key: "email",
    label: "Email",
    type: "text",
    placeholder: "Filter by email...",
  },
];

export const columns: Column<ProductOwner>[] = [
  { id: "name", label: "Name", minWidth: 180 },
  { id: "email", label: "Email", minWidth: 220 },
  {
    id: "phone",
    label: "Phone",
    minWidth: 140,
    render: (row) => row.phone || "-",
  },
];

export function buildQueryParams(params: ProductOwnerListParams) {
  return {
    ...(params.name ? { name: params.name } : {}),
    ...(params.email ? { email: params.email } : {}),
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy as "name" | "email" | "phone",
    sortOrder: params.sortOrder as "asc" | "desc",
  };
}
