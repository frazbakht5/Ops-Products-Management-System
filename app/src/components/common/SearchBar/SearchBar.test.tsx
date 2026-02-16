import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import SearchBar from "./index";

describe("SearchBar", () => {
  it("renders with placeholder", () => {
    renderWithTheme(
      <SearchBar value="" onChange={vi.fn()} placeholder="Search..." />,
    );

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders with default placeholder", () => {
    renderWithTheme(<SearchBar value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    renderWithTheme(<SearchBar value="hello" onChange={vi.fn()} />);

    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  it("calls onChange with debounced value after typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(<SearchBar value="" onChange={onChange} delay={50} />);

    const input = screen.getByPlaceholderText("Search…");
    await user.type(input, "test");

    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("test");
  });
});
