import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSnackbar } from "notistack";

import { getErrorMessage } from "../../utils/getErrorMessage";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import FilterBar, {
  type FilterConfig,
} from "../../components/common/FilterBar";
import DataTable, { type Column } from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useUrlParams } from "../../hooks/useUrlParams";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../store/api/productApi";
import type { Product } from "../../types/product";

// ── Defaults ────────────────────────────────────────────────────────────────
const DEFAULTS = {
  name: "",
  sku: "",
  ownerName: "",
  status: "",
  page: 1,
  limit: 10,
  sortBy: "name",
  sortOrder: "asc",
} as const;

// ── Sort options ────────────────────────────────────────────────────────────
const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Name", value: "name" },
  { label: "SKU", value: "sku" },
  { label: "Price", value: "price" },
  { label: "Inventory", value: "inventory" },
  { label: "Status", value: "status" },
];

// ── Filter config ───────────────────────────────────────────────────────────
const filterConfigs: FilterConfig[] = [
  {
    key: "sku",
    label: "SKU",
    type: "text",
    placeholder: "Filter by SKU…",
  },
  {
    key: "ownerName",
    label: "Owner",
    type: "text",
    placeholder: "Filter by owner…",
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

// ── Columns ─────────────────────────────────────────────────────────────────
const columns: Column<Product>[] = [
  { id: "name", label: "Name", minWidth: 160 },
  { id: "sku", label: "SKU", minWidth: 120 },
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    align: "right",
    render: (row) => `$${row.price.toFixed(2)}`,
  },
  { id: "inventory", label: "Inventory", minWidth: 100, align: "right" },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    render: (row) => (
      <Chip
        label={row.status}
        size="small"
        color={row.status === "ACTIVE" ? "success" : "default"}
        variant="outlined"
      />
    ),
  },
  {
    id: "owner",
    label: "Owner",
    minWidth: 140,
    sortable: false,
    render: (row) => row.owner?.name ?? "—",
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function ProductListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [params, setParams] = useUrlParams(DEFAULTS);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  // Build query params (strip empty strings)
  const queryParams = useMemo(
    () => ({
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
    }),
    [params],
  );

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSearch = (value: string) =>
    setParams({ name: value, page: 1 } as Partial<typeof DEFAULTS>);

  const handleFilterChange = (key: string, value: string) =>
    setParams({ [key]: value, page: 1 } as Partial<typeof DEFAULTS>);

  const handleSortChange = (field: string) => {
    const isAsc = params.sortBy === field && params.sortOrder === "asc";
    setParams({
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
      page: 1,
    } as Partial<typeof DEFAULTS>);
  };

  // DataTable is 0-based, API is 1-based
  const handlePageChange = (newPage: number) =>
    setParams({ page: newPage + 1 } as Partial<typeof DEFAULTS>);

  const handleRowsPerPageChange = (newLimit: number) =>
    setParams({ limit: newLimit, page: 1 } as Partial<typeof DEFAULTS>);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete product"), { variant: "error" });
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        title="Products"
        onCreateClick={() => navigate("/products/new")}
        createLabel="Add Product"
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <SearchBar
          value={params.name}
          onChange={handleSearch}
          placeholder="Search by name…"
        />

        <FilterBar
          filters={filterConfigs}
          values={{
            sku: params.sku,
            ownerName: params.ownerName,
            status: params.status,
          }}
          onChange={handleFilterChange}
        />

        <TextField
          select
          size="small"
          label="Sort By"
          value={params.sortBy}
          onChange={(e) =>
            setParams({
              sortBy: e.target.value,
              page: 1,
            } as Partial<typeof DEFAULTS>)
          }
          sx={{ minWidth: 140 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <Tooltip title={params.sortOrder === "asc" ? "Ascending" : "Descending"}>
          <IconButton
            size="small"
            onClick={() =>
              setParams({
                sortOrder: params.sortOrder === "asc" ? "desc" : "asc",
                page: 1,
              } as Partial<typeof DEFAULTS>)
            }
          >
            {params.sortOrder === "asc" ? (
              <ArrowUpwardIcon fontSize="small" />
            ) : (
              <ArrowDownwardIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </div>

      <DataTable<Product>
        columns={columns}
        rows={data?.items ?? []}
        total={data?.total ?? 0}
        page={params.page - 1}
        rowsPerPage={params.limit}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder as "asc" | "desc"}
        loading={isLoading || isFetching}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        onRowClick={(row) => navigate(`/products/${row.id}`)}
        emptyMessage="No products found"
        emptyActionLabel="Add Product"
        onEmptyAction={() => navigate("/products/new")}
        renderActions={(row) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => navigate(`/products/${row.id}`)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteTarget(row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </>
  );
}
