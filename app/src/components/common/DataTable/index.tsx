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
import { useTheme } from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import AddIcon from "@mui/icons-material/Add";

import type { Column, DataTableProps } from "./types";

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
  const theme = useTheme();
  const headerCount = columns.length + (hasActions ? 1 : 0);

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
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => {
                const sortable = col.sortable !== false;
                const active = sortBy === col.id;

                return (
                  <TableCell
                    key={col.id}
                    align="center"
                    style={{ minWidth: col.minWidth }}
                    sx={{
                      borderRight:
                        idx < headerCount - 1
                          ? `1px solid ${theme.palette.divider}`
                          : undefined,
                    }}
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
                <TableCell
                  align="center"
                  style={{ minWidth: 120 }}
                  sx={{
                    borderRight: undefined,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

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
                      <TableCell key={col.id} align="center">
                        {col.render
                          ? col.render(row)
                          : String(
                              (row as Record<string, unknown>)[col.id] ?? "",
                            )}
                      </TableCell>
                    ))}

                    {hasActions && (
                      <TableCell align="center">
                        <Box
                          className="flex items-center justify-center gap-1"
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

export type { Column, DataTableProps };
