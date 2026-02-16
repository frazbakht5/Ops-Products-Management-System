import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

import { getErrorMessage } from "../../../utils/getErrorMessage";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterBar from "../../../components/common/FilterBar";
import DataTable from "../../../components/common/DataTable";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useUrlParams } from "../../../hooks/useUrlParams";
import {
  useGetProductOwnersQuery,
  useDeleteProductOwnerMutation,
} from "../../../store/api/productOwnerApi";
import type { ProductOwner } from "../../../types/productOwner";
import {
  DEFAULTS,
  filterConfigs,
  columns,
  buildQueryParams,
  type ProductOwnerListParams,
} from "./helper";

export default function ProductOwnerListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [params, setParams] = useUrlParams(DEFAULTS);

  const [deleteTarget, setDeleteTarget] = useState<ProductOwner | null>(null);
  const [deleteOwner, { isLoading: isDeleting }] =
    useDeleteProductOwnerMutation();

  const queryParams = useMemo(() => buildQueryParams(params), [params]);
  const { data, isLoading, isFetching } = useGetProductOwnersQuery(queryParams);

  const handleSearch = (value: string) =>
    setParams({ name: value, page: 1 } as Partial<ProductOwnerListParams>);

  const handleFilterChange = (key: string, value: string) =>
    setParams({ [key]: value, page: 1 } as Partial<ProductOwnerListParams>);

  const handleSortChange = (field: string) => {
    const isAsc = params.sortBy === field && params.sortOrder === "asc";
    setParams({
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
      page: 1,
    } as Partial<ProductOwnerListParams>);
  };

  const handlePageChange = (newPage: number) =>
    setParams({ page: newPage + 1 } as Partial<ProductOwnerListParams>);

  const handleRowsPerPageChange = (newLimit: number) =>
    setParams({ limit: newLimit, page: 1 } as Partial<ProductOwnerListParams>);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOwner(deleteTarget.id).unwrap();
      enqueueSnackbar("Product owner deleted successfully", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete product owner"), {
        variant: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Product Owners"
        onCreateClick={() => navigate("/product-owners/new")}
        createLabel="Add Owner"
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <SearchBar
          value={params.name}
          onChange={handleSearch}
          placeholder="Search by name..."
        />

        <FilterBar
          filters={filterConfigs}
          values={{ email: params.email }}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
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
        onRowClick={(row) => navigate(`/product-owners/${row.id}`)}
        emptyMessage="No product owners found"
        emptyActionLabel="Add Owner"
        onEmptyAction={() => navigate("/product-owners/new")}
        renderActions={(row) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => navigate(`/product-owners/${row.id}`)}
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
