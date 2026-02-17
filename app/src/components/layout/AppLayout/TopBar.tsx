import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "../../../hooks/useThemeMode";
import type { TopBarProps } from "./types";

export default function TopBar({ isDesktop, onMenuClick }: TopBarProps) {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);

  return (
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
            onClick={onMenuClick}
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
          component={RouterLink}
          to="/products"
          variant="h6"
          noWrap
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
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
  );
}
