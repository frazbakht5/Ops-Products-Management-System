import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSnackbar } from "notistack";

import { getErrorMessage } from "../../../utils/getErrorMessage";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterBar from "../../../components/common/FilterBar";
import DataTable, { type Column } from "../../../components/common/DataTable";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useUrlParams } from "../../../hooks/useUrlParams";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../store/api/productApi";
import type { Product } from "../../../types/product";
import {
  DEFAULTS,
  SORT_OPTIONS,
  filterConfigs,
  columns,
  buildQueryParams,
  type ProductListParams,
} from "./helper";

export default function ProductListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [params, setParams] = useUrlParams(DEFAULTS);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const queryParams = useMemo(() => buildQueryParams(params), [params]);
  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);

  const handleSearch = (value: string) =>
    setParams({ name: value, page: 1 } as Partial<ProductListParams>);

  const handleFilterChange = (key: string, value: string) =>
    setParams({ [key]: value, page: 1 } as Partial<ProductListParams>);

  const handleSortChange = (field: string) => {
    const isAsc = params.sortBy === field && params.sortOrder === "asc";
    setParams({
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
      page: 1,
    } as Partial<ProductListParams>);
  };

  const handlePageChange = (newPage: number) =>
    setParams({ page: newPage + 1 } as Partial<ProductListParams>);

  const handleRowsPerPageChange = (newLimit: number) =>
    setParams({ limit: newLimit, page: 1 } as Partial<ProductListParams>);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete product"), {
        variant: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const tableColumns = useMemo(() => {
    const imageColumn: Column<Product> = {
      id: "imagePreview",
      label: "",
      minWidth: 120,
      sortable: false,
      render: (row: Product) =>
        row.image ? (
          <Avatar
            variant="rounded"
            src={`data:${row.imageMimeType ?? "image/png"};base64,${row.image}`}
            alt={row.name}
            sx={{ width: 48, height: 48, margin: "0 auto" }}
          />
        ) : (
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              margin: "0 auto",
              bgcolor: "action.hover",
              color: "text.disabled",
            }}
          >
            <InsertPhotoOutlinedIcon fontSize="small" />
          </Avatar>
        ),
    };

    const enrichedColumns = columns.map((col) =>
      col.id === "status"
        ? {
            ...col,
            render: (row: Product) => (
              <Chip
                label={row.status}
                size="small"
                color={row.status === "ACTIVE" ? "success" : "default"}
                variant="outlined"
              />
            ),
          }
        : col,
    );

    return [imageColumn, ...enrichedColumns];
  }, []);

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
          placeholder="Search by name..."
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
            } as Partial<ProductListParams>)
          }
          sx={{ minWidth: 140 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <Tooltip
          title={params.sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          <IconButton
            size="small"
            onClick={() =>
              setParams({
                sortOrder: params.sortOrder === "asc" ? "desc" : "asc",
                page: 1,
              } as Partial<ProductListParams>)
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

      <DataTable
        columns={tableColumns}
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
