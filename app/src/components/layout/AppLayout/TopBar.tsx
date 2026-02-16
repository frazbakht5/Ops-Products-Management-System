import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
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
  );
}
