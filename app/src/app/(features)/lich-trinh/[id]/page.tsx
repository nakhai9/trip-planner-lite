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
      <div className="mt-10 md:p-0 px-4">
        <div className="relative">
          <h4 className="top-1/2 left-1/2 z-10 absolute font-bold text-white text-xl md:text-4xl text-center -translate-x-1/2 -translate-y-1/2">
            {details ? details["title"] : "Hành trình"}
          </h4>
          <img
            className="w-full h-40 md:h-80"
            src="https://i.pinimg.com/originals/54/fc/29/54fc29bd3a4bd6468f0fbb05e98f9486.jpg"
            alt=""
          />
        </div>

        {qrCodeUrl && (
          <div className="flex justify-center items-center px-4 md:px-0">
            <h4 className="text-gray-700 text-xs text-center">
              Hãy gởi bạn bè của bạn mã QR này để họ dễ dàng theo dõi lịch trình
            </h4>
            <img
              src={qrCodeUrl}
              alt="qr"
              className="w-20 w-20 md:w-30 md:h-30"
            />
          </div>
        )}

        <div className="gap-2 grid md:grid-cols-3">
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
