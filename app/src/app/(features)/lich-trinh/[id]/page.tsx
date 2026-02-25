"use client";
import MainLayout from "@/app/ui/layout/MainLayout";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { API_URLS } from "@/app/libs/api/api.constant";
import { HttpClient } from "@/app/libs/api/axios";
import { PlanDetails } from "@/app/model";
import DestinationItem from "@/app/components/Destination";
import { Info } from "lucide-react";
type PlanDetailsProps = {};
export default function PlanDetailsPage({}: PlanDetailsProps) {
  const params = useParams();
  const id = params.id as string;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { setIsLoading, isLoading } = useGlobalStore();
  const { showError } = useToast();
  const [details, setDetails] = useState<PlanDetails | null>(null);
  const [passcode, setPasscode] = useState<string>("");
  const [canView, setCanView] = useState<boolean>(true);

  const fetchPlanDetails = useCallback(
    async (passcode?: string) => {
      setIsLoading(true);
      try {
        const details = await HttpClient.post<any>(
          `${API_URLS.plan}/${id}`,
          passcode && {
            password: passcode,
          },
        );
        setDetails(details);
        setCanView(details.id ? true : false);
      } catch (error) {
        showError("Không thể tải dữ liệu");
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
      if (!passcode.length) {
        showError("Bạn cần nhập mã bảo vệ khi chọn chế độ riêng tư");
        return;
      }

      if (passcode.length < 6) {
        showError("Mã bảo vệ tối đa 6 kí tự");
        return;
      }

      await fetchPlanDetails(passcode);
    } catch (error) {
      showError("Thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeChange = (e: any) => {
    const passcode = (e.target as HTMLInputElement)?.value ?? "";
    setPasscode(passcode);
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
          {!canView && (
            <div className="flex flex-col items-center gap-2 md:mx-auto w-full md:w-90">
              <p className="font-medium text-lg">Đây là lịch trình riêng tư</p>
              <div className="w-full">
                <label
                  htmlFor="#passcode"
                  className="block mb-1 font-medium text-sm"
                >
                  Mã bảo vệ <span className="text-red-600">*</span>
                </label>
                <input
                  id="passcode"
                  type="password"
                  placeholder="Nhập mã bảo vệ"
                  className="px-2 border-2 border-amber-600 rounded-md outline-none w-full h-10"
                  value={passcode}
                  onChange={handlePasscodeChange}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={onSubmit}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          )}
          {canView && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-amber-500 text-xl md:text-4xl">
                    {details ? details["title"] : "Hành trình"}
                  </h4>
                  <p className="text-gray-700 text-xs md:text-sm">
                    Hãy gởi bạn bè của bạn mã QR này để họ dễ dàng theo dõi lịch
                    trình
                  </p>
                </div>
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="qr"
                    className="w-16 w-16 md:w-30 md:h-30"
                  />
                )}
              </div>

              <div className="gap-2 grid md:grid-cols-3 mt-3">
                {(details?.destinations ?? []).map((destination) => (
                  <DestinationItem
                    key={destination.codeName}
                    destination={destination}
                    readonly={true}
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
