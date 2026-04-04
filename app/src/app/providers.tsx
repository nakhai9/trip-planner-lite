"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

declare module "@mui/material/styles" {
  interface TypeText {
    default: string;
  }
}

const colors = {
  backgroundDefault: "#F4F6FF",
  primaryMain: "#FF7315",
  textSecondary: "#3A3535",
  textPrimary: "#232020",
  contrastText: "#FFFFFF",
  error: "#DD0303",
};

export const theme = createTheme({
  palette: {
    background: {
      default: colors.backgroundDefault,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      default: "#fff", // custom
    },
    primary: {
      main: colors.primaryMain,
      contrastText: colors.contrastText,
    },
    grey: {
      500: colors.textSecondary,
      900: colors.textPrimary,
    },
    error: {
      main: colors.error,
    },
  },

  typography: {
    allVariants: {
      color: colors.textPrimary,
    },
  },

  spacing: 4,
  shape: { borderRadius: 8 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
  },
});

export const LAYOUT_WIDTH_RESPONSIVE = {
  md: 672, // w-2xl in tailwindcss
  lg: 1152, // w-6xl in tailwindcss
};

export function TBProviders({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui", enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
