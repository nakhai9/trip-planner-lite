"use client";
import MapViewer from "@/app/components/MapViewer";
import SocialShare from "@/app/components/SocialShare";
import { API_URLS } from "@/app/libs/api/api.constant";
import { HttpClient } from "@/app/libs/api/axios";
import { LocationInfo } from "@/app/model";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import MainLayout from "@/app/ui/layout/MainLayout";
import { Dialog, Tooltip } from "@mui/material";
import clsx from "clsx";
import {
  Flag,
  Footprints,
  MapPinned,
  PinOff,
  RotateCw,
  Share2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ChiaSeHinhAnh() {
  const [location, setLocation] = React.useState<LocationInfo | null>(null);
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("https://example.com");
  const [modalName, setModalName] = React.useState<string | null>(null);
  const router = useRouter();
  const { setIsLoading } = useGlobalStore();
  const { showError, showInfo } = useToast();

  const {
    updateSelectedLocationsToShare,
    selectedLocationsToShare,
    resetSelectedLocationsToShare,
  } = useVietnamMapStore();

  const handleChooseLocation = (location: LocationInfo) => {
    openMarkModal();
    setLocation(location);
  };

  const pinLocation = (location: LocationInfo) => {
    setOpen(false);
    updateSelectedLocationsToShare({
      ...location,
      status: "VISITED",
    });
  };

  const unpinLocation = (location: LocationInfo) => {
    setOpen(false);
    updateSelectedLocationsToShare({
      ...location,
      status: "NOT_VISITED",
    });
  };

  const uploadImages = async () => {
    const svgElement = document.getElementById("vietnam-map-svg");

    if (!svgElement) {
      showInfo("Không tìm thấy bản đồ SVG");
      return;
    }

    const clone = svgElement.cloneNode(true) as SVGSVGElement;

    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgString = new XMLSerializer().serializeToString(clone);

    const blob = new Blob([svgString], { type: "image/svg+xml" });

    const formData = new FormData();
    formData.append("file", blob, "vietnam-map.svg");

    const res = await fetch(API_URLS.upload, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    await updatePlanImages(data.data.url);
    setUrl(data.data.url);
    setIsLoading(false);
  };

  const onShareModal = async () => {
    setIsLoading(true, "Đang tạo hình ảnh để chia sẻ");
    try {
      await uploadImages();
      setModalName("share-modal");
      setOpen(true);
    } catch (error) {
      showError("Không thể thực hiện thao tác này");
    } finally {
      setIsLoading(false);
    }
  };

  const openMarkModal = () => {
    setModalName("mark-modal");
    setOpen(true);
  };

  const handleMarkUpcoming = (location: LocationInfo) => {
    setOpen(false);
    updateSelectedLocationsToShare({
      ...location,
      status: "UPCOMING",
    });
  };

  const navigateToPage = (url?: string) => {
    if (!url) return;
    router.push(url);
  };

  useEffect(() => {
    resetSelectedLocationsToShare();
  }, []);

  const updatePlanImages = async (url: string, userId?: string) => {
    await HttpClient.post<{ url: string; userId?: string }>(
      API_URLS.planImage,
      { url, userId },
    );
  };

  return (
    <MainLayout hideButton={false}>
      <div className="mt-20 md:p-0 px-4">
        <div className="flex justify-end items-center gap-2">
          {selectedLocationsToShare.filter((x) => x.status === "UPCOMING")
            .length > 0 && (
            <Tooltip title="Tạo lịch trình">
              <button
                onClick={() => navigateToPage("/lich-trinh")}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
              >
                <MapPinned className="w-4 md:w-5 h-4 md:h-5" /> Tạo lịch trình
              </button>
            </Tooltip>
          )}
          {selectedLocationsToShare.length > 0 && (
            <>
              <Tooltip title="Tạo hình ảnh để chia sẻ">
                <button
                  onClick={onShareModal}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                >
                  <Share2 className="w-4 md:w-5 h-4 md:h-5" /> Chia sẻ lên mạng
                  xã hội
                </button>
              </Tooltip>
              <Tooltip title="Khôi phục">
                <button
                  onClick={resetSelectedLocationsToShare}
                  className="flex items-center gap-2 bg-white hover:bg-amber-50 px-4 border border-amber-500 rounded-md h-8 md:h-10 text-amber-500 hover:text-amber-600 text-xs md:text-sm cursor-pointer icon"
                >
                  <RotateCw className="w-4 md:w-5 h-4 md:h-5" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
        <MapViewer
          locations={selectedLocationsToShare}
          onChoose={(location) => handleChooseLocation(location)}
        />
      </div>
      <Dialog open={open} keepMounted>
        <div className="flex justify-between items-center p-5 dialog-header">
          <h3 className="font-medium md:text-lg">
            {modalName === "mark-modal" ? "Địa điểm" : "Chia sẻ hành trình"}
          </h3>
          <button
            className="text-gray-700 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <div className="p-5 min-w-56">
          {modalName === "mark-modal" && (
            <div className="w-48 md:w-64">
              <div className="mb-4 font-medium text-2xl text-center">
                {location?.name ?? "-"}
              </div>
              <div className="flex justify-center gap-6 md:gap-10">
                {location?.status !== "UPCOMING" && (
                  <button
                    onClick={() => pinLocation(location as LocationInfo)}
                    className={clsx(
                      `flex flex-col justify-center items-center gap-2 cursor-pointer`,
                      location?.status === "VISITED" ? "!text-[#FE9A00]" : "",
                    )}
                  >
                    <Flag />
                    <p className="text-xs md:text-sm">Đã đến</p>
                  </button>
                )}
                {location?.status !== "VISITED" && (
                  <button
                    onClick={() => handleMarkUpcoming(location as LocationInfo)}
                    className={clsx(
                      `flex flex-col justify-center items-center gap-2 cursor-pointer`,
                      location?.status === "UPCOMING" && "text-[#836FFF]",
                    )}
                  >
                    <Footprints />
                    <p className="text-xs md:text-sm">Sắp đến</p>
                  </button>
                )}

                {location?.status && location?.status !== "NOT_VISITED" && (
                  <button
                    onClick={() => unpinLocation(location as LocationInfo)}
                    className="flex flex-col justify-center items-center gap-2 cursor-pointer"
                  >
                    <PinOff />
                    <p className="text-xs md:text-sm">Tháo ghim</p>
                  </button>
                )}
              </div>
            </div>
          )}

          {modalName === "share-modal" && <SocialShare url={url} />}
        </div>
      </Dialog>
    </MainLayout>
  );
}
