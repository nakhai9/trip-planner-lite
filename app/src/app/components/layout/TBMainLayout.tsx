"use client";

import TBModal from "@/app/components/TBModal";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Map } from "lucide-react";
import TBToast from "../ui/TBToast";
import { useRouter } from "next/navigation";
import TBButton from "../ui/TBButton";
import { LAYOUT_WIDTH_RESPONSIVE } from "@/app/providers";

const styles = {
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "inherit",
    bgcolor: "background.default",
  },
  appBar: {
    bgcolor: "background.default",
    color: "text.primary",
    zIndex: (t: any) => t.zIndex.drawer + 1,
  },
  toolbar: {
    justifyContent: { xs: "center", md: "space-between" },
    gap: 2,
    maxWidth: { md: 672, lg: 1152 },
    width: "100%",
    mx: "auto",
    px: { xs: 2, md: 0 },
    minHeight: 56,
  },
  logo: {
    bgcolor: "primary.main",
    color: "text.primary",
    px: { xs: 2, md: 1 },
    py: { xs: 1, md: 0 },
    fontWeight: 500,
    fontSize: { xs: "1.25rem", md: "1.875rem" },
    cursor: "pointer",
    textAlign: { xs: "center", md: "left" },
  },
  button: (d: boolean) => ({
    ...(d ? { opacity: 0.5, pointerEvents: "none" } : {}),
    "& svg": { width: { xs: 16, md: 20 }, height: { xs: 16, md: 20 } },
  }),
  main: { flex: 1, pt: 7 },
  container: {
    maxWidth: { ...LAYOUT_WIDTH_RESPONSIVE },
    mx: "auto",
    width: "100%",
  },
  backdrop: { zIndex: 9999 },
  loadingText: {
    color: "common.white",
    px: 2,
    textAlign: "center",
    fontSize: { xs: "0.75rem", md: "0.875rem" },
  },
};

type TBMainLayoutProps = { children: React.ReactNode; hideButton?: boolean };

export default function TBMainLayout({
  children,
  hideButton = false,
}: TBMainLayoutProps) {
  const { isLoading, loadingMessage, setIsLoading } = useGlobalStore();
  const { message, isShow, type, hideToast } = useToast();
  const { switchToMap, isNewMap, selectedLocationsToShare } =
    useVietnamMapStore();
  const router = useRouter();
  const open = false;

  const onSwitchToMap = () => {
    setIsLoading(true, "Đang nạp dữ liệu bản đồ");
    switchToMap();
    setIsLoading(false);
  };

  return (
    <Box sx={styles.root}>
      <AppBar position="fixed" elevation={2} sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Typography
            component="h1"
            onClick={() => router.push("/")}
            sx={styles.logo}
          >
            Tripbuilder
          </Typography>

          {!hideButton && (
            <Stack direction="row" spacing={2}>
              {!selectedLocationsToShare.length && (
                <TBButton
                  variant="outline"
                  type="button"
                  onClick={onSwitchToMap}
                  disabled={selectedLocationsToShare.length > 0}
                  sx={styles.button(selectedLocationsToShare.length > 0)}
                  leftIcon={<Map />}
                >
                  Bản đồ {isNewMap ? "mới" : "cũ"}
                </TBButton>
              )}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={styles.main}>
        <Container maxWidth={false} sx={styles.container}>
          {children}
        </Container>
      </Box>

      {open && <TBModal />}

      <Backdrop sx={styles.backdrop} open={isLoading}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="warning" />
          {loadingMessage && (
            <Typography sx={styles.loadingText}>{loadingMessage}</Typography>
          )}
        </Stack>
      </Backdrop>

      <TBToast
        isShow={isShow}
        message={message}
        type={type}
        onClose={hideToast}
      />
    </Box>
  );
}
