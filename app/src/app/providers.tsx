"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#d97706" },
    secondary: { main: "#f59e0b" },
    error: { main: "#dc2626" },
    background: {
      default: "#f8fbff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // 👈 màu chữ chính (khuyên dùng)
      secondary: "#475569", // 👈 chữ phụ
    },
  },
  spacing: 4,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
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
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
