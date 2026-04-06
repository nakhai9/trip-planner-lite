"use client";

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
import TbToast from "../ui/TbToast";
import { useRouter } from "next/navigation";
import TbButton from "../ui/TbButton";
import { LAYOUT_WIDTH_RESPONSIVE } from "@/app/providers";
import { useGlobalStore, useToast } from "@/store/global-store";
import { useVietnamMapStore } from "@/store/vietnam-map-store";
import TbModal from "../ui/TbModal";

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
    position: "fixed",
    bgcolor: "background.paper",
    color: "text.primary",
    borderBottom: 1,
    borderColor: "divider",
    boxShadow: "none",
  },

  appBarToolbar: {
    maxWidth: { ...LAYOUT_WIDTH_RESPONSIVE },
    mx: "auto",
    width: "100%",
    textAlign: "center",
    minHeight: { xs: 56, sm: 64 },
  },

  appBarTitle: {
    cursor: "pointer",
    fontWeight: 500,
    flexShrink: 0,
    backgroundColor: "primary.main",
    color: "text.default",
    px: 4,
    py: 1,
  },

  main: { flex: 1 },
  container: {
    maxWidth: { ...LAYOUT_WIDTH_RESPONSIVE },
    mx: "auto",
    width: "100%",
    px: {
      xs: 4,
      md: 0,
      lg: 0,
    },
  },
  backdrop: { zIndex: 9999 },
  loadingText: {
    color: "common.white",
    px: 2,
    textAlign: "center",
    fontSize: { xs: "0.75rem", md: "0.875rem" },
  },
};

type TbMainLayoutProps = { children: React.ReactNode; hideButton?: boolean };

export default function TbMainLayout({
  children,
  hideButton = false,
}: TbMainLayoutProps) {
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
      <AppBar component="nav" elevation={0} sx={styles.appBar}>
        <Toolbar sx={styles.appBarToolbar} disableGutters>
          <Typography
            variant="h6"
            onClick={() => router.push("/")}
            sx={styles.appBarTitle}
          >
            Trip Builder
          </Typography>
          <Box sx={{ flex: 1 }} />
          {!hideButton && (
            <TbButton
              variant="outline"
              size="small"
              leftIcon={<Map size={18} />}
              onClick={onSwitchToMap}
            >
              Bản đồ
            </TbButton>
          )}
        </Toolbar>
      </AppBar>
      {/* Giữ đúng chiều cao Toolbar để nội dung không bị AppBar fixed che */}
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
      <Box component="main" sx={styles.main}>
        <Container maxWidth={false} sx={styles.container}>
          {children}
        </Container>
      </Box>
      {open && <TbModal />}
      <Backdrop sx={styles.backdrop} open={isLoading}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="warning" />
          {loadingMessage && (
            <Typography sx={styles.loadingText}>{loadingMessage}</Typography>
          )}
        </Stack>
      </Backdrop>
      <TbToast
        isShow={isShow}
        message={message}
        type={type}
        onClose={hideToast}
      />
    </Box>
  );
}
