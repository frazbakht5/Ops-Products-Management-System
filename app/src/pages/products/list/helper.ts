import type { Column } from "../../../components/common/DataTable";
import type { FilterConfig } from "../../../components/common/FilterBar";
import type { Product } from "../../../types/product";

export const DEFAULTS = {
  name: "",
  sku: "",
  ownerName: "",
  status: "",
  page: 1,
  limit: 10,
  sortBy: "name",
  sortOrder: "asc",
} as const;

export type ProductListParams = typeof DEFAULTS;

export const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Name", value: "name" },
  { label: "SKU", value: "sku" },
  { label: "Price", value: "price" },
  { label: "Inventory", value: "inventory" },
  { label: "Status", value: "status" },
];

export const filterConfigs: FilterConfig[] = [
  {
    key: "sku",
    label: "SKU",
    type: "text",
    placeholder: "Filter by SKU...",
  },
  {
    key: "ownerName",
    label: "Owner",
    type: "text",
    placeholder: "Filter by owner...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
];

export const columns: Column<Product>[] = [
  { id: "name", label: "Name", minWidth: 160 },
  { id: "sku", label: "SKU", minWidth: 120 },
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    render: (row) => `$${row.price.toFixed(2)}`,
  },
  { id: "inventory", label: "Inventory", minWidth: 100 },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    render: (row) => row.status,
  },
  {
    id: "owner",
    label: "Owner",
    minWidth: 140,
    sortable: false,
    render: (row) => row.owner?.name ?? "-",
  },
];

export function buildQueryParams(params: ProductListParams) {
  return {
    ...(params.name ? { name: params.name } : {}),
    ...(params.sku ? { sku: params.sku } : {}),
    ...(params.ownerName ? { ownerName: params.ownerName } : {}),
    ...(params.status
      ? { status: params.status as "ACTIVE" | "INACTIVE" }
      : {}),
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy as
      | "name"
      | "sku"
      | "price"
      | "inventory"
      | "status",
    sortOrder: params.sortOrder as "asc" | "desc",
  };
}
