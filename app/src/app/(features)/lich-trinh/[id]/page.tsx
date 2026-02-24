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
type PlanDetailsProps = {};
export default function PlanDetailsPage({}: PlanDetailsProps) {
  const params = useParams();
  const id = params.id as string;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { setIsLoading } = useGlobalStore();
  const { showError } = useToast();
  const [details, setDetails] = useState<PlanDetails | null>(null);

  useEffect(() => {
    if (id) {
      initQRCode(id);
    }
    fetchPlanDetails();
  }, [id]);

  const fetchPlanDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const details = await HttpClient.get<PlanDetails>(
        `${API_URLS.plan}/${id}`,
      );
      setDetails(details);
    } catch (error) {
      showError("Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const getQrCodeUrl = async (id: string) => {
    return await QRCode.toDataURL(`${window.location.origin}/lich-trinh/${id}`);
  };

  const initQRCode = async (id: string) => {
    const url = await getQrCodeUrl(id);
    setQrCodeUrl(url);
  };

  return (
    <MainLayout hideButton={true}>
      <div className="mt-10 mt-20 md:p-0 px-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-amber-500 text-xl md:text-4xl">
              {details ? details["title"] : "Hành trình"}
            </h4>
            <p className="text-gray-700 text-xs md:text-sm">
              Hãy gởi bạn bè của bạn mã QR này để họ dễ dàng theo dõi lịch trình
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
          {details?.destinations.map((destination) => (
            <DestinationItem
              key={destination.codeName}
              destination={destination}
              readonly={true}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
