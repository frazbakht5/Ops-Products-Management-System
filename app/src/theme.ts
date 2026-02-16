import { createTheme, type PaletteMode } from "@mui/material/styles";

export function buildTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#1565c0",
        light: "#1e88e5",
        dark: "#0d47a1",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff7043",
        light: "#ff8a65",
        dark: "#e64a19",
      },
      background: {
        default: isDark ? "#0f1419" : "#f5f7fa",
        paper: isDark ? "#1a2332" : "#ffffff",
      },
      divider: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1a2332" : undefined,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? "#111921" : "#102a43",
            color: "#ffffff",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              fontWeight: 600,
              backgroundColor: isDark ? "#1e2d3d" : "#f0f4f8",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.08)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: isDark ? "rgba(255,255,255,0.2)" : undefined,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.23)",
            },
          },
        },
      },
    },
  });
}

// Default export for backwards compatibility
const theme = buildTheme("light");
export default theme;
