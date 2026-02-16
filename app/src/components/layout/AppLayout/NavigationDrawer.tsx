import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/DashboardRounded";

import type { NavigationDrawerProps } from "./types";

export default function NavigationDrawer({
  navItems,
  pathname,
  onNavigate,
}: NavigationDrawerProps) {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box className="flex h-full flex-col">
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

      <List sx={{ flex: 1, px: 1.5, pt: 1.5 }}>
        {navItems.map(({ label, path, icon: IconComponent }) => {
          const isActive = pathname.startsWith(path);
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate(path)}
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
                  <IconComponent />
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

      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.35)", display: "block" }}
        >
          &copy; {currentYear} Ops Products
        </Typography>
      </Box>
    </Box>
  );
}
