import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import { useThemeMode } from "../../hooks/useThemeMode";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Products", path: "/products", icon: <InventoryIcon /> },
  { label: "Product Owners", path: "/product-owners", icon: <PeopleIcon /> },
  { label: "About", path: "/about", icon: <InfoIcon /> },
];

export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (!isDesktop) setMobileOpen(false);
  };

  const drawerContent = (
    <Box className="flex h-full flex-col">
      {/* Brand */}
      <Box
        className="flex items-center gap-3 px-5"
        sx={{ height: 64, flexShrink: 0 }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: alpha(theme.palette.primary.light, 0.25),
            color: theme.palette.primary.light,
          }}
        >
          <DashboardIcon fontSize="small" />
        </Avatar>
        <Typography
          variant="subtitle1"
          noWrap
          sx={{ fontWeight: 700, letterSpacing: "0.02em" }}
        >
          OPS Manager
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, pt: 1.5 }}>
        {navItems.map(({ label, path, icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  transition: "all 0.15s ease",
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.light, 0.18),
                    color: theme.palette.primary.light,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.light,
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.light, 0.24),
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? theme.palette.primary.light
                      : "rgba(255,255,255,0.6)",
                    minWidth: 38,
                    transition: "color 0.15s ease",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Footer */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.35)", display: "block" }}
        >
          &copy; {new Date().getFullYear()} Ops Products
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box className="flex min-h-screen" sx={{ bgcolor: "background.default" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(8px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component="span"
            aria-hidden
            sx={{
              width: 48,
              height: 28,
              mr: 2,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="44"
              height="18"
              viewBox="0 0 44 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="appLogoGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path
                d="M4 9c0-2.761 2.239-5 5-5 2.094 0 3.743 1.033 5.192 3.12.26.373.622.576.978.575.357 0 .72-.205.98-.58C17.61 5.03 19.26 4 21.356 4c2.761 0 5 2.239 5 5s-2.239 5-5 5c-2.092 0-3.743-1.034-5.197-3.126-.26-.372-.622-.574-.977-.574-.355 0-.717.202-.978.574C12.75 15.97 11.1 17 9.004 17 6.239 17 4 14.761 4 12z"
                fill="url(#appLogoGradient)"
                fillRule="evenodd"
              />
              <path
                d="M38.004 17c-2.094 0-3.744-1.033-5.197-3.126-.26-.372-.622-.574-.977-.574-.355 0-.717.202-.978.574C29.4 15.968 27.75 17 25.656 17c-2.765 0-5.004-2.239-5.004-5s2.239-5 5.004-5c2.094 0 3.744 1.033 5.197 3.12.26.373.622.576.977.575.355 0 .717-.205.978-.58C33.6 5.03 35.25 4 37.344 4 40.108 4 42.347 6.239 42.347 9s-2.239 5-5.004 5z"
                fill="url(#appLogoGradient)"
                fillOpacity="0.9"
                fillRule="evenodd"
              />
            </svg>
          </Box>

          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              flex: 1,
            }}
          >
            Ops Products Management
          </Typography>

          <IconButton
            color="inherit"
            onClick={(e) => setSettingsAnchor(e.currentTarget)}
            sx={{ color: "text.secondary" }}
          >
            <SettingsIcon />
          </IconButton>

          <Menu
            anchorEl={settingsAnchor}
            open={!!settingsAnchor}
            onClose={() => setSettingsAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 180,
                  mt: 1,
                  borderRadius: 2,
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                toggleMode();
                setSettingsAnchor(null);
              }}
            >
              <ListItemIcon>
                {mode === "light" ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {mode === "light" ? "Dark Mode" : "Light Mode"}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Desktop drawer — persistent */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "none",
              boxShadow: "1px 0 8px rgba(0,0,0,0.12)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile drawer — temporary */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        className="flex-1"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar /> {/* spacer for fixed AppBar */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
