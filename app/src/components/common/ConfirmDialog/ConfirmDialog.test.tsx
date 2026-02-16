import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import ConfirmDialog from "./index";

describe("ConfirmDialog", () => {
  const baseProps = {
    open: true,
    message: "Delete this item?",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it("renders title, message, and buttons when open", () => {
    renderWithTheme(<ConfirmDialog {...baseProps} />);

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText("Delete this item?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("does not render dialog content when closed", () => {
    renderWithTheme(<ConfirmDialog {...baseProps} open={false} />);

    expect(screen.queryByText("Delete this item?")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithTheme(<ConfirmDialog {...baseProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithTheme(<ConfirmDialog {...baseProps} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("shows loading state and disables buttons", () => {
    renderWithTheme(<ConfirmDialog {...baseProps} loading />);

    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("uses custom title and labels", () => {
    renderWithTheme(
      <ConfirmDialog
        {...baseProps}
        title="Custom Title"
        confirmLabel="Yes"
        cancelLabel="No"
      />,
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
  });
});
