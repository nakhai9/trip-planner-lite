"use client";

import { useState } from "react";

import TBMainLayout from "@/app/components/layout/TBMainLayout";
import type { ItineraryLocation as TBDestinationV2Model } from "@/app/components/Itinerary/TbItineraryLocation";
import TBButton from "@/app/components/ui/TBButton";
import { Utils } from "@/app/libs/utils";
import { Paper } from "@mui/material";
import TBInput from "@/app/components/ui/TBInput";
import { Calendar1, ExternalLink, NotebookPen, Share2 } from "lucide-react";
import { Box, Stack, Typography } from "@mui/material";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import _ from "lodash";
import TBIconButton from "@/app/components/ui/TBIconButton";
import { HttpClient } from "@/app/libs/api/axios";
import { API_URLS } from "@/app/libs/api/api.constant";
import { useRouter } from "next/navigation";
import { ResponseId } from "@/app/libs/api/api.models";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DATE_FORMAT } from "@/app/libs/constants";
import QRCode from "qrcode";

type TBTripData = {
  id?: string;
  title: string;
  description: string;
  startDate: Dayjs;
  endDate: Dayjs;
  accessCode?: string;
  isPrivate: boolean;
};

type TBTripDay = {
  day: number;
  destinations: TBDestinationV2Model[];
};

export default function TBCreateTripPlanPage() {
  const { showError, showSuccess } = useToast();
  const { setIsLoading } = useGlobalStore();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [tripData, setTripData] = useState<TBTripData>({
    title: "",
    description: "",
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
    accessCode: "",
    isPrivate: false,
  });
  const [createdPlan, setCreatedPlan] = useState<TBTripData | null>(null);

  const getQrCodeUrl = async (id: string) => {
    return await QRCode.toDataURL(`${window.location.origin}/lich-trinh/${id}`);
  };

  const genQRCode = async (id: string) => {
    const url = await getQrCodeUrl(id);
    setQrCodeUrl(url);
  };

  const handleChange = (key: keyof TBTripData, value: any) => {
    setTripData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      startDate: dayjs(),
      endDate: dayjs().add(1, "day"),
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
    <TBMainLayout hideButton>
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
                <TBInput
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
                <Stack flexDirection="row" alignItems="center" gap={2}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    slotProps={{ textField: { size: "small", required: true } }}
                    defaultValue={dayjs(tripData.startDate)}
                    onChange={(value: Dayjs | null) => {
                      const isBeforeToday = value?.isBefore(dayjs());
                      if (isBeforeToday) {
                        showError(
                          "Ngày bắt đầu không được trước ngày hiện tại",
                        );
                        return;
                      }
                      handleChange(
                        "startDate",
                        value?.format(DATE_FORMAT) || "",
                      );
                    }}
                    format={DATE_FORMAT}
                  />
                  đến
                  <DatePicker
                    label="Ngày kết thúc"
                    slotProps={{ textField: { size: "small", required: true } }}
                    defaultValue={dayjs(tripData.endDate)}
                    onChange={(value: Dayjs | null) => {
                      if (!value) return;
                      const start = dayjs(tripData.startDate, DATE_FORMAT);

                      if (value.isBefore(start, "day")) {
                        showError(
                          "Ngày kết thúc không được trước ngày bắt đầu",
                        );
                        return;
                      }
                      handleChange("endDate", value?.format(DATE_FORMAT) || "");
                    }}
                    format={DATE_FORMAT}
                  />
                </Stack>
                <Stack
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <TBButton type="button" onClick={handleSave}>
                    Lưu
                  </TBButton>
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
                  {createdPlan.startDate.format(DATE_FORMAT)} -{" "}
                  {createdPlan.endDate.format(DATE_FORMAT) || "?"}
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
                  <TBIconButton onClick={copyToShare}>
                    <Share2 size={20} />
                  </TBIconButton>
                  <TBIconButton>
                    <NotebookPen size={20} />
                  </TBIconButton>
                  <TBIconButton
                    onClick={() => router.push(`/lich-trinh/${createdPlan.id}`)}
                  >
                    <ExternalLink size={20} />
                  </TBIconButton>
                </Stack>
                <Box></Box>
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </TBMainLayout>
  );
}
