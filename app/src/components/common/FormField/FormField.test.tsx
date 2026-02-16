import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import FormField from "./index";

describe("FormField", () => {
  it("renders a text field with label", () => {
    renderWithTheme(
      <FormField name="title" label="Title" value="" onChange={vi.fn()} />,
    );

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    renderWithTheme(
      <FormField name="title" label="Title" value="Hello" onChange={vi.fn()} />,
    );

    expect(screen.getByLabelText("Title")).toHaveValue("Hello");
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(
      <FormField name="title" label="Title" value="" onChange={onChange} />,
    );

    await user.type(screen.getByLabelText("Title"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows error message", () => {
    renderWithTheme(
      <FormField
        name="title"
        label="Title"
        value=""
        onChange={vi.fn()}
        error="Required"
      />,
    );

    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("renders as disabled", () => {
    renderWithTheme(
      <FormField
        name="title"
        label="Title"
        value=""
        onChange={vi.fn()}
        disabled
      />,
    );

    expect(screen.getByLabelText("Title")).toBeDisabled();
  });

  it("renders a select field with options", () => {
    renderWithTheme(
      <FormField
        name="status"
        label="Status"
        type="select"
        value="ACTIVE"
        onChange={vi.fn()}
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
        ]}
      />,
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("renders select options when clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FormField
        name="status"
        label="Status"
        type="select"
        value=""
        onChange={vi.fn()}
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
        ]}
      />,
    );

    await user.click(screen.getByLabelText("Status"));
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("marks field as required", () => {
    renderWithTheme(
      <FormField
        name="title"
        label="Title"
        value=""
        onChange={vi.fn()}
        required
      />,
    );

    expect(screen.getByLabelText(/Title/)).toBeRequired();
  });

  it("renders multiline text field", () => {
    renderWithTheme(
      <FormField
        name="description"
        label="Description"
        value=""
        onChange={vi.fn()}
        multiline
        rows={4}
      />,
    );

    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Description").tagName).toBe("TEXTAREA");
  });
});
