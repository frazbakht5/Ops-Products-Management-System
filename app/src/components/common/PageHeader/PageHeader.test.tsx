import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import PageHeader from "./index";

describe("PageHeader", () => {
  it("renders the title", () => {
    renderWithTheme(<PageHeader title="Products" />);

    expect(
      screen.getByRole("heading", { name: "Products" }),
    ).toBeInTheDocument();
  });

  it("renders create button when onCreateClick is provided", () => {
    renderWithTheme(
      <PageHeader title="Products" onCreateClick={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /Create New/i }),
    ).toBeInTheDocument();
  });

  it("does not render create button when onCreateClick is absent", () => {
    renderWithTheme(<PageHeader title="Products" />);

    expect(
      screen.queryByRole("button", { name: /Create/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onCreateClick when the button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithTheme(<PageHeader title="Products" onCreateClick={onClick} />);

    await user.click(screen.getByRole("button", { name: /Create New/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses custom create label", () => {
    renderWithTheme(
      <PageHeader
        title="Products"
        onCreateClick={vi.fn()}
        createLabel="Add Product"
      />,
    );

    expect(
      screen.getByRole("button", { name: /Add Product/i }),
    ).toBeInTheDocument();
  });
});
