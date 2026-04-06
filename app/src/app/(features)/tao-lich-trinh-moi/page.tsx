"use client";

import { useState } from "react";

import QRCode from "qrcode";
import dayjs, { Dayjs } from "dayjs";
import { useGlobalStore, useToast } from "@/store/global-store";
import { useRouter } from "next/navigation";
import { HttpClient } from "@/libs/api/http";
import { ResponseId } from "@/types/api";
import { API_URLS } from "@/libs/api/api.constant";
import TbMainLayout from "@/components/layout/TbMainLayout";
import { Box, Paper, Stack, Typography } from "@mui/material";
import TbInput from "@/components/ui/TbInput";

import TbButton from "@/components/ui/TbButton";
import { Calendar1, ExternalLink, NotebookPen, Share2 } from "lucide-react";
import TbIconButton from "@/components/ui/TbIconButton";

import { DATE_FORMAT } from "@/libs/constants";
import TbDateRangePicker, {
  TbDateRangePickerEvent,
} from "@/components/ui/TbDateRangePicker";

type TripData = {
  id?: string;
  title: string;
  description: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  accessCode?: string;
  isPrivate: boolean;
};

export default function TBCreateTripPlanPage() {
  const { showError, showSuccess } = useToast();
  const { setIsLoading } = useGlobalStore();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [tripData, setTripData] = useState<TripData>({
    title: "",
    description: "",
    startDate: dayjs().add(1, "day"),
    endDate: dayjs().add(2, "day"),
    accessCode: "",
    isPrivate: false,
  });
  const [createdPlan, setCreatedPlan] = useState<TripData | null>(null);

  const getQrCodeUrl = async (id: string) => {
    return await QRCode.toDataURL(`${window.location.origin}/lich-trinh/${id}`);
  };

  const genQRCode = async (id: string) => {
    const url = await getQrCodeUrl(id);
    setQrCodeUrl(url);
  };

  const handleChange = (key: keyof TripData, value: any) => {
    setTripData((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleDateChange = (e: TbDateRangePickerEvent) => {
    handleChange("startDate", e.from);

    const isBeforeToday = dayjs(e.from)?.isBefore(dayjs());
    if (isBeforeToday) {
      showError("Ngày bắt đầu không được ở quá khứ");
      return;
    }
    handleChange("startDate", e.from || "");

    if (!e.to) return;
    const start = dayjs(e.from);

    if (
      dayjs(e.to).isBefore(start, "day") ||
      dayjs(e.to).isBefore(dayjs(), "day")
    ) {
      showError("Ngày kết thúc không được trước ngày bắt đầu hoặc ở quá khứ");
      return;
    }

    handleChange("endDate", e.to);
  };

  const handleSave = async () => {
    try {
      if (!tripData.title) {
        showError("Bạn chưa đặt tên cho lịch trình");
        return;
      }

      resetState();
      setIsLoading(true);

      const data = await HttpClient.post<ResponseId>(API_URLS.plan, {
        ...tripData,
        startDate: dayjs(tripData.startDate).toISOString(),
        endDate: dayjs(tripData.endDate).toISOString(),
      });
      setCreatedPlan({ ...tripData, id: data.id });
      genQRCode(data.id);

      showSuccess("Tạo hành trình thành công");
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setTripData({
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      accessCode: undefined,
      isPrivate: false,
    });
  };

  const copyToShare = async () => {
    if (!createdPlan?.id) return;
    const url = `${window.location.origin}/lich-trinh/${createdPlan.id}`;
    navigator.clipboard.writeText(url);
    showSuccess("Đã sao chép đường dẫn chia sẻ");
  };

  return (
    <TbMainLayout hideButton>
      <Paper
        sx={{
          mt: "40px !important",
          backgroundColor: "background.paper",
          p: 4,
          maxWidth: "400px !important",
          mx: "auto",
        }}
      >
        <Stack spacing={4}>
          {!createdPlan ? (
            <>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  textAlign: "center",
                }}
              >
                Tạo lịch trình mới để trải nghiệm chuyến đi của bạn
              </Typography>
              <Stack spacing={6}>
                <TbInput
                  label="Tên hành trình"
                  type="text"
                  value={tripData.title || ""}
                  size="medium"
                  variant="standard"
                  required
                  onChange={(e: any) =>
                    handleChange(
                      "title",
                      (e.target as HTMLInputElement)?.value || "",
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!tripData.title.trim()) {
                        showError("Tên hành trình không được để trống");
                        return;
                      }
                    }
                  }}
                />
                <TbDateRangePicker
                  from={tripData.startDate || undefined}
                  to={tripData.endDate || undefined}
                  fromTitle="Bắt đầu"
                  toTitle="Kết thúc"
                  format={DATE_FORMAT}
                  onDateChange={(e) => handleDateChange(e)}
                />
                <Stack
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <TbButton type="button" onClick={handleSave}>
                    Lưu
                  </TbButton>
                </Stack>
              </Stack>
            </>
          ) : (
            <>
              <Typography variant="h5" component="h4">
                {createdPlan.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Calendar1 size={16} />
                <Typography variant="body1" component="h5">
                  {dayjs(createdPlan.startDate).format(DATE_FORMAT)} -{" "}
                  {dayjs(createdPlan.endDate).format(DATE_FORMAT)}
                </Typography>
              </Box>
              {qrCodeUrl && (
                <Stack alignItems="center" flexDirection="column">
                  <Box
                    component="img"
                    src={qrCodeUrl}
                    alt="qr"
                    sx={{
                      width: { xs: 150, md: 200, lg: 250 },
                      height: { xs: 150, md: 200, lg: 250 },
                    }}
                  />
                  <Typography variant="caption">
                    Quét mã QR để xem chi tiết
                  </Typography>
                </Stack>
              )}
              <Box>
                <Stack
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={1}
                >
                  <TbIconButton onClick={copyToShare}>
                    <Share2 size={20} />
                  </TbIconButton>
                  <TbIconButton>
                    <NotebookPen size={20} />
                  </TbIconButton>
                  <TbIconButton
                    onClick={() => router.push(`/lich-trinh/${createdPlan.id}`)}
                  >
                    <ExternalLink size={20} />
                  </TbIconButton>
                </Stack>
                <Box></Box>
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </TbMainLayout>
  );
}
