import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { renderWithTheme } from "../../../test/test-utils";
import { ThemeContext } from "../../../context/themeContextValue";
import TopBar from "./TopBar";

function renderTopBar(
  props: { isDesktop: boolean; onMenuClick: () => void },
  mode: "light" | "dark" = "light",
) {
  const toggleMode = vi.fn();
  return {
    toggleMode,
    ...renderWithTheme(
      <MemoryRouter>
        <ThemeContext.Provider value={{ mode, toggleMode }}>
          <TopBar {...props} />
        </ThemeContext.Provider>
      </MemoryRouter>,
    ),
  };
}

describe("TopBar", () => {
  it("renders the app title", () => {
    renderTopBar({ isDesktop: true, onMenuClick: vi.fn() });

    expect(screen.getByText("Ops Products Management")).toBeInTheDocument();
  });

  it("hides menu button on desktop", () => {
    renderTopBar({ isDesktop: true, onMenuClick: vi.fn() });

    // Menu icon button should not be present (the testid for the menu icon's button)
    const buttons = screen.getAllByRole("button");
    // Only the settings button should be present
    expect(buttons).toHaveLength(1);
  });

  it("shows menu button on mobile and calls onMenuClick", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    renderTopBar({ isDesktop: false, onMenuClick });

    const buttons = screen.getAllByRole("button");
    // Two buttons: menu + settings
    expect(buttons).toHaveLength(2);

    // Click first button (menu)
    await user.click(buttons[0]);
    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("opens settings menu and shows dark mode option in light mode", async () => {
    const user = userEvent.setup();
    renderTopBar({ isDesktop: true, onMenuClick: vi.fn() }, "light");

    // Click settings button
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });

  it("opens settings menu and shows light mode option in dark mode", async () => {
    const user = userEvent.setup();
    renderTopBar({ isDesktop: true, onMenuClick: vi.fn() }, "dark");

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Light Mode")).toBeInTheDocument();
  });

  it("calls toggleMode when theme toggle is clicked", async () => {
    const user = userEvent.setup();
    const { toggleMode } = renderTopBar(
      { isDesktop: true, onMenuClick: vi.fn() },
      "light",
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Dark Mode"));
    expect(toggleMode).toHaveBeenCalledOnce();
  });
});
