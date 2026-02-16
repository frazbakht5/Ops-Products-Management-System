import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import DataTable from "./index";
import type { Column } from "./types";

interface TestRow {
  id: string;
  name: string;
  value: number;
}

const columns: Column<TestRow>[] = [
  { id: "name", label: "Name", minWidth: 100 },
  { id: "value", label: "Value", minWidth: 80 },
];

const rows: TestRow[] = [
  { id: "1", name: "Item A", value: 10 },
  { id: "2", name: "Item B", value: 20 },
];

const baseProps = {
  columns,
  rows,
  total: 2,
  page: 0,
  rowsPerPage: 10,
  sortBy: "name",
  sortOrder: "asc" as const,
  onPageChange: vi.fn(),
  onRowsPerPageChange: vi.fn(),
  onSortChange: vi.fn(),
};

describe("DataTable", () => {
  it("renders column headers", () => {
    renderWithTheme(<DataTable {...baseProps} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders row data", () => {
    renderWithTheme(<DataTable {...baseProps} />);

    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    // Use getAllByText for values that also appear in pagination controls
    const tens = screen.getAllByText("10");
    expect(tens.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders custom cell via render function", () => {
    const customColumns: Column<TestRow>[] = [
      {
        id: "name",
        label: "Name",
        render: (row) => <span data-testid={`custom-${row.id}`}>{row.name.toUpperCase()}</span>,
      },
    ];

    renderWithTheme(<DataTable {...baseProps} columns={customColumns} />);

    expect(screen.getByTestId("custom-1")).toHaveTextContent("ITEM A");
    expect(screen.getByTestId("custom-2")).toHaveTextContent("ITEM B");
  });

  it("shows skeleton loading state", () => {
    renderWithTheme(<DataTable {...baseProps} rows={[]} loading />);

    // Should not show actual data
    expect(screen.queryByText("Item A")).not.toBeInTheDocument();
    // MUI Skeleton renders as span with specific class
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("shows empty state when no rows and not loading", () => {
    renderWithTheme(
      <DataTable {...baseProps} rows={[]} total={0} emptyMessage="Nothing here" />,
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by creating a new record."),
    ).toBeInTheDocument();
  });

  it("shows empty action button when handler provided", async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();
    renderWithTheme(
      <DataTable
        {...baseProps}
        rows={[]}
        total={0}
        onEmptyAction={onEmptyAction}
        emptyActionLabel="Add Item"
      />,
    );

    const btn = screen.getByRole("button", { name: /Add Item/i });
    await user.click(btn);
    expect(onEmptyAction).toHaveBeenCalledOnce();
  });

  it("calls onSortChange when sortable header clicked", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    renderWithTheme(<DataTable {...baseProps} onSortChange={onSortChange} />);

    await user.click(screen.getByText("Name"));
    expect(onSortChange).toHaveBeenCalledWith("name");
  });

  it("does not render sort label for non-sortable columns", () => {
    const cols: Column<TestRow>[] = [
      { id: "name", label: "Name", sortable: false },
    ];
    renderWithTheme(<DataTable {...baseProps} columns={cols} />);

    // The header should still show "Name" text but not as a button
    const headerCells = screen.getAllByRole("columnheader");
    const nameHeader = headerCells.find((h) => h.textContent === "Name");
    expect(nameHeader).toBeInTheDocument();
    // No sort button inside
    expect(
      within(nameHeader!).queryByRole("button"),
    ).not.toBeInTheDocument();
  });

  it("calls onRowClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderWithTheme(<DataTable {...baseProps} onRowClick={onRowClick} />);

    await user.click(screen.getByText("Item A"));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it("renders actions column when renderActions is provided", () => {
    renderWithTheme(
      <DataTable
        {...baseProps}
        renderActions={(row) => (
          <button data-testid={`action-${row.id}`}>Edit</button>
        )}
      />,
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByTestId("action-1")).toBeInTheDocument();
    expect(screen.getByTestId("action-2")).toBeInTheDocument();
  });

  it("displays pagination with correct total", () => {
    renderWithTheme(<DataTable {...baseProps} total={25} />);

    // MUI pagination shows "1–{rowsPerPage} of total"
    expect(screen.getByText(/of 25/)).toBeInTheDocument();
  });
});
