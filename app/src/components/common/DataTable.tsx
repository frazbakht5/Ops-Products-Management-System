import { type MouseEvent } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import AddIcon from "@mui/icons-material/Add";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface Column<T> {
  /** Unique key that maps to a field on T (used for sorting). */
  id: string;
  /** Column header label. */
  label: string;
  /** Whether this column is sortable (default true). */
  sortable?: boolean;
  /** Minimum width in px. */
  minWidth?: number;
  /** Horizontal alignment. */
  align?: "left" | "center" | "right";
  /** Custom cell renderer. Falls back to `String(row[id])`. */
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  total: number;
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  loading?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSortChange: (field: string) => void;
  onRowClick?: (row: T) => void;
  /** Render an actions cell (e.g. edit / delete buttons). */
  renderActions?: (row: T) => React.ReactNode;
  /** Text shown when rows are empty (default: "No records found"). */
  emptyMessage?: string;
  /** Label for the create button in the empty state. */
  emptyActionLabel?: string;
  /** Called when the create button in the empty state is clicked. */
  onEmptyAction?: () => void;
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function DataTable<T extends object>({
  columns,
  rows,
  total,
  page,
  rowsPerPage,
  sortBy,
  sortOrder,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onRowClick,
  renderActions,
  emptyMessage = "No records found",
  emptyActionLabel,
  onEmptyAction,
}: DataTableProps<T>) {
  const hasActions = !!renderActions;
  const skeletonRows = Array.from({ length: rowsPerPage }, (_, i) => i);
  const isEmpty = !loading && rows.length === 0;

  const handleSort = (field: string) => () => onSortChange(field);

  const handlePageChange = (
    _event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => onPageChange(newPage);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  return (
    <Paper variant="outlined" className="overflow-hidden">
      <TableContainer>
        <Table size="small">
          {/* ── Head ─────────────────────────────────────────────── */}
          <TableHead>
            <TableRow>
              {columns.map((col) => {
                const sortable = col.sortable !== false;
                const active = sortBy === col.id;

                return (
                  <TableCell
                    key={col.id}
                    align={col.align ?? "left"}
                    style={{ minWidth: col.minWidth }}
                    sortDirection={active ? sortOrder : false}
                  >
                    {sortable ? (
                      <TableSortLabel
                        active={active}
                        direction={active ? sortOrder : "asc"}
                        onClick={handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                );
              })}

              {hasActions && (
                <TableCell align="right" style={{ minWidth: 120 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          {/* ── Body ─────────────────────────────────────────────── */}
          <TableBody>
            {loading
              ? skeletonRows.map((i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              : isEmpty
                ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (hasActions ? 1 : 0)}
                        align="center"
                        sx={{ py: 8 }}
                      >
                        <Box className="flex flex-col items-center gap-2">
                          <InboxIcon sx={{ fontSize: 48 }} color="disabled" />
                          <Typography variant="h6" color="text.secondary">
                            {emptyMessage}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="mb-2">
                            Get started by creating a new record.
                          </Typography>
                          {onEmptyAction && (
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={onEmptyAction}
                            >
                              {emptyActionLabel ?? "Create New"}
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                : rows.map((row, idx) => (
                  <TableRow
                    key={(row as Record<string, unknown>).id as string ?? idx}
                    hover
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align ?? "left"}>
                        {col.render
                          ? col.render(row)
                          : String(
                              (row as Record<string, unknown>)[col.id] ?? "",
                            )}
                      </TableCell>
                    ))}

                    {hasActions && (
                      <TableCell align="right">
                        <Box
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {renderActions(row)}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Pagination ──────────────────────────────────────────── */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
}
