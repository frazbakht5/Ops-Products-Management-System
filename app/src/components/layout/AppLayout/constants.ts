import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import type { NavItem } from "./types";

export const DRAWER_WIDTH = 260;

export const navItems: NavItem[] = [
  { label: "Products", path: "/products", icon: InventoryIcon },
  { label: "Product Owners", path: "/product-owners", icon: PeopleIcon },
  { label: "About", path: "/about", icon: InfoIcon },
];
