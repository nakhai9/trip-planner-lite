"use client";

import { useRouter } from "next/navigation";
import TBMainLayout from "@/app/ui/layout/TBMainLayout";
import TBButton from "@/app/ui/TBButton";
import { useGlobalStore } from "@/app/store/global-store";
import { Card, CardContent, Stack, Typography } from "@mui/material";


export default function TBHomePage() {
  const router = useRouter();
  const { setIsLoading } = useGlobalStore();

  const navigateToPage = (url?: string) => {
    if (!url) return;
    setIsLoading(true);
    router.push(url);
    setIsLoading(false);
  };

  return (
    <TBMainLayout hideButton={true}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        sx={{ mt: { xs: 12, md: 20 }, px: { xs: 2, md: 0 } }}
      >
        <Card
          variant="outlined"
          sx={{
            maxWidth: { md: 280 },
            width: "100%",
            borderColor: "grey.200",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography color="primary" fontWeight={500} variant="h6">
              Tạo hành trình
            </Typography>
            <Typography variant="body2" sx={{ minHeight: 64 }}>
              Dễ dàng lên kế hoạch cá nhân/nhóm cho những chuyến du lịch
            </Typography>
            <TBButton onClick={() => navigateToPage("/lich-trinh")}>Bắt đầu</TBButton>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            maxWidth: { md: 280 },
            width: "100%",
            borderColor: "grey.200",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography color="primary" fontWeight={500} variant="h6">
              Chia sẻ
            </Typography>
            <Typography variant="body2" sx={{ minHeight: 64 }}>
              Tạo và chia sẻ hành trình những nơi đã đi qua dưới dạng hình ảnh
            </Typography>
            <TBButton onClick={() => navigateToPage("/chia-se-hinh-anh")}>
              Bắt đầu
            </TBButton>
          </CardContent>
        </Card>
      </Stack>
    </TBMainLayout>
  );
}
