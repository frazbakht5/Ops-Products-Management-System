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
