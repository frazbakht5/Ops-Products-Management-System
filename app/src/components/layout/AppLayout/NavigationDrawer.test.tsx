import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../test/test-utils";
import NavigationDrawer from "./NavigationDrawer";
import type { NavItem } from "./types";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";

const navItems: NavItem[] = [
  { label: "Home", path: "/home", icon: HomeIcon },
  { label: "About", path: "/about", icon: InfoIcon },
];

describe("NavigationDrawer", () => {
  it("renders brand name", () => {
    renderWithTheme(
      <NavigationDrawer
        navItems={navItems}
        pathname="/"
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText("OPS Manager")).toBeInTheDocument();
  });

  it("renders all nav items", () => {
    renderWithTheme(
      <NavigationDrawer
        navItems={navItems}
        pathname="/"
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("highlights the active nav item", () => {
    renderWithTheme(
      <NavigationDrawer
        navItems={navItems}
        pathname="/about"
        onNavigate={vi.fn()}
      />,
    );

    const aboutButton = screen.getByText("About").closest('[role="button"]');
    expect(aboutButton).toHaveClass("Mui-selected");

    const homeButton = screen.getByText("Home").closest('[role="button"]');
    expect(homeButton).not.toHaveClass("Mui-selected");
  });

  it("calls onNavigate when a nav item is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderWithTheme(
      <NavigationDrawer
        navItems={navItems}
        pathname="/"
        onNavigate={onNavigate}
      />,
    );

    await user.click(screen.getByText("About"));
    expect(onNavigate).toHaveBeenCalledWith("/about");
  });

  it("renders copyright year in the footer", () => {
    renderWithTheme(
      <NavigationDrawer
        navItems={navItems}
        pathname="/"
        onNavigate={vi.fn()}
      />,
    );

    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${year} Ops Products`)),
    ).toBeInTheDocument();
  });
});
