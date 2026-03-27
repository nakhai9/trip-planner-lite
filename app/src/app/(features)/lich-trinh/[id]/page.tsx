"use client";
import TBMainLayout from "@/app/ui/layout/TBMainLayout";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { API_URLS } from "@/app/libs/api/api.constant";
import { HttpClient } from "@/app/libs/api/axios";
import { PlanDetails } from "@/app/model";
import TBButton from "@/app/ui/TBButton";
import TBInput from "@/app/ui/TBInput";
import TbItineraryLocation from "@/app/components/Itinerary/TbItineraryLocation";
import type { ItineraryLocation as TBDestinationV2Model } from "@/app/components/Itinerary/TbItineraryLocation";
import { Box, Stack, Typography } from "@mui/material";

type TBPlanDetailsProps = {};
export default function TBPlanDetailsPage({}: TBPlanDetailsProps) {
  const params = useParams();
  const id = params.id as string;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { setIsLoading, isLoading } = useGlobalStore();
  const { showError } = useToast();
  const [details, setDetails] = useState<PlanDetails | null>(null);
  const [accessCode, setAccessCode] = useState<string>("");

  const fetchPlanDetails = useCallback(
    async (accessCode?: string) => {
      setIsLoading(true);
      try {
        const details = await HttpClient.post<PlanDetails>(
          `${API_URLS.plan}/${id}`,
          accessCode && {
            accessCode: accessCode,
          },
        );
        setDetails(details);
      } catch (error: unknown) {
        showError(error || "Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    },
    [id, setIsLoading, showError],
  );

  const getQrCodeUrl = async (id: string) => {
    return await QRCode.toDataURL(`${window.location.origin}/lich-trinh/${id}`);
  };

  const initQRCode = async (id: string) => {
    const url = await getQrCodeUrl(id);
    setQrCodeUrl(url);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (!accessCode.length) {
        showError("Bạn cần nhập mã bảo vệ khi chọn chế độ riêng tư");
        return;
      }

      if (accessCode.length < 6) {
        showError("Mã bảo vệ tối đa 6 kí tự");
        return;
      }

      await fetchPlanDetails(accessCode);
    } catch (error) {
      showError("Thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accessCode = e.target?.value ?? "";
    setAccessCode(accessCode);
  };

  useEffect(() => {
    if (id) {
      initQRCode(id);
      fetchPlanDetails();
    }
  }, [id, fetchPlanDetails]);

  return (
    <TBMainLayout hideButton={true}>
      {details && (
        <Box sx={{ mt: { xs: 10, md: 10 }, px: { xs: 2, md: 0 } }}>
          {!details.canView && (
            <Stack
              spacing={2}
              alignItems="center"
              sx={{ mx: "auto", width: "100%", maxWidth: { md: 360 } }}
            >
              {qrCodeUrl && (
                <Box
                  component="img"
                  src={qrCodeUrl}
                  alt="qr"
                  sx={{
                    width: { xs: 64, md: 160 },
                    height: { xs: 64, md: 160 },
                  }}
                />
              )}
              <Typography fontWeight={500} color="error.main">
                Đây là lịch trình riêng tư
              </Typography>
              <TBInput
                id="accessCode"
                type="password"
                label="Mã bảo vệ"
                required
                placeholder="Nhập mã bảo vệ"
                value={accessCode}
                onChange={handleAccessCodeChange}
              />
              <Stack direction="row" alignItems="flex-end">
                <TBButton type="button" onClick={onSubmit}>
                  Xem chi tiết
                </TBButton>
              </Stack>
            </Stack>
          )}
          {!isLoading && details.canView && (
            <>
              <Stack spacing={1} sx={{ py: { xs: 1, md: 3 } }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="primary.main"
                  sx={{ fontSize: { xs: "1.25rem", md: "2.125rem" } }}
                >
                  {details["title"]}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={300}
                >
                  A relaxing beach vacation with college friends
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  mt: 2,
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                }}
              >
                {(details?.destinations ?? []).map((destination) => (
                  <TbItineraryLocation
                    key={destination.id}
                    destination={destination as TBDestinationV2Model}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}
    </TBMainLayout>
  );
}
