"use client";
import MainLayout from "@/app/ui/layout/MainLayout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { API_URLS } from "@/app/libs/api/api.constant";
import { CirclePlus, MapPin } from "lucide-react";
type PlanDetailsProps = {};
export default function PlanDetails({}: PlanDetailsProps) {
  const params = useParams();
  const id = params.id as string;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { setIsLoading } = useGlobalStore();
  const { showError } = useToast();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const handle = async () => {
      if (!id) return;

      const url = await getQrCodeUrl(id);
      await fetchPlanDetail(id);
      setQrCodeUrl(url);
    };

    handle();
  }, [id]);

  const fetchPlanDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URLS.plan}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setDetails(data.data);
    } catch (error) {
      showError("Lỗi: không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const getQrCodeUrl = async (id: string) => {
    return await QRCode.toDataURL(`http://localhosy:4200/lich-trinh/${id}`);
  };

  return (
    <MainLayout hideButton={true}>
      <div className="mt-10">
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
            <h4 className="text-gray-700 text-center">
              Hãy gởi bạn bè của bạn mã QR này để họ dễ dàng theo dõi lịch trình
            </h4>
            <img
              src={qrCodeUrl}
              alt="qr"
              className="w-30 w-30 md:w-40 md:h-40"
            />
          </div>
        )}
        <div>Xem chi tiết</div>
      </div>
    </MainLayout>
  );
}
