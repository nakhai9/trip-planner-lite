"use client";
import MainLayout from "@/app/ui/layout/MainLayout";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { API_URLS } from "@/app/libs/api/api.constant";
import { HttpClient } from "@/app/libs/api/axios";
import { PlanDetails } from "@/app/model";
import DestinationCard from "@/app/components/Destination";
import Button from "@/app/ui/button";
import Input from "@/app/ui/input";
import { Info, Pencil, X } from "lucide-react";
import IconButton from "@/app/ui/icon-button";
type PlanDetailsProps = {};
export default function PlanDetailsPage({}: PlanDetailsProps) {
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
      } catch (error: any) {
        showError(error || "Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    },
    [id],
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

  const handleAccessCodeChange = (e: any) => {
    const accessCode = (e.target as HTMLInputElement)?.value ?? "";
    setAccessCode(accessCode);
  };

  useEffect(() => {
    if (id) {
      initQRCode(id);
      fetchPlanDetails();
    }
  }, [fetchPlanDetails]);

  return (
    <MainLayout hideButton={true}>
      {details && (
        <div className="mt-10 mt-20 md:p-0 px-4">
          {!details.canView && (
            <div className="flex flex-col items-center gap-2 md:mx-auto w-full md:w-90">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="qr"
                  className="w-16 md:w-40 h-16 md:h-40"
                />
              )}
              <p className="font-medium text-red-600">
                Đây là lịch trình riêng tư
              </p>
              <Input
                id="accessCode"
                type="password"
                label="Mã bảo vệ"
                required
                placeholder="Nhập mã bảo vệ"
                value={accessCode}
                onChange={handleAccessCodeChange}
              />
              <div className="flex items-end">
                <Button type="button" onClick={onSubmit}>
                  Xem chi tiết
                </Button>
              </div>
            </div>
          )}
          {!isLoading && details.canView && (
            <>
              <div className="flex flex-col gap-2 py-2 md:py-5">
                <h4 className="block font-bold text-amber-500 text-xl md:text-4xl">
                  {details["title"]}
                </h4>
                <p className="block font-thin text-gray-500">
                  A relaxing beach vacation with college friends
                </p>
              </div>

              <div className="gap-3 grid md:grid-cols-2 lg:grid-cols-3 mt-3">
                {(details?.destinations ?? []).map((destination) => (
                  <DestinationCard
                    key={destination.codeName}
                    destination={destination}
                    readonly={true}
                    version="v2"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </MainLayout>
  );
}
