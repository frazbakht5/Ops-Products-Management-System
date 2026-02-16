import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../test/test-utils";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the heading", () => {
    renderWithTheme(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: "About" }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderWithTheme(<AboutPage />);

    expect(
      screen.getByText(
        /manage your product catalogue and product owners/i,
      ),
    ).toBeInTheDocument();
  });
});
