import type React from "react";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export interface NavigationDrawerProps {
  navItems: NavItem[];
  pathname: string;
  onNavigate: (path: string) => void;
}

export interface TopBarProps {
  isDesktop: boolean;
  onMenuClick: () => void;
}
