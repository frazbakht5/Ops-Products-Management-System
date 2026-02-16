import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import FilterBar from "./index";
import type { FilterConfig } from "./types";

describe("FilterBar", () => {
  it("renders text filter with label and placeholder", () => {
    const filters: FilterConfig[] = [
      { key: "name", label: "Name", type: "text", placeholder: "Search..." },
    ];

    renderWithTheme(
      <FilterBar filters={filters} values={{ name: "" }} onChange={vi.fn()} />,
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders select filter with options", async () => {
    const user = userEvent.setup();
    const filters: FilterConfig[] = [
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

    renderWithTheme(
      <FilterBar
        filters={filters}
        values={{ status: "" }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();

    // Open the select
    await user.click(screen.getByLabelText("Status"));
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("calls onChange with debounced value when text filter changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const filters: FilterConfig[] = [
      { key: "name", label: "Name", type: "text" },
    ];

    renderWithTheme(
      <FilterBar filters={filters} values={{ name: "" }} onChange={onChange} />,
    );

    await user.type(screen.getByLabelText("Name"), "abc");

    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall).toEqual(["name", "abc"]);
  });

  it("calls onChange when select filter value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const filters: FilterConfig[] = [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [{ label: "Active", value: "ACTIVE" }],
      },
    ];

    renderWithTheme(
      <FilterBar
        filters={filters}
        values={{ status: "" }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText("Status"));
    await user.click(screen.getByText("Active"));
    expect(onChange).toHaveBeenCalledWith("status", "ACTIVE");
  });

  it("renders multiple filters", () => {
    const filters: FilterConfig[] = [
      { key: "name", label: "Name", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [{ label: "Active", value: "ACTIVE" }],
      },
    ];

    renderWithTheme(
      <FilterBar
        filters={filters}
        values={{ name: "", status: "" }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });
});
