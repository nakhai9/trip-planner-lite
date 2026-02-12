"use client";

import React from "react";

import { Dialog, Tooltip } from "@mui/material";
import MapViewer from "./components/MapViewer";
import {
  Flag,
  Footprints,
  Map,
  MapPinned,
  Pin,
  PinOff,
  RotateCw,
  Share2,
  X,
} from "lucide-react";
import { LocationInfo } from "./model";
import { useVietnamMapStore } from "./store/vietnam-map-store";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import SocialShare from "./components/SocialShare";
import { useGlobalStore, useToast } from "./store/global-store";
import MainLayout from "./ui/layout/MainLayout";
import { API_URLS } from "./common/api.constant";

export default function Home() {
  const [location, setLocation] = React.useState<LocationInfo | null>(null);
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("https://example.com");
  const [isViewDetails, setIsViewDetails] = React.useState(false);
  const [modalName, setModalName] = React.useState<string | null>(null);
  const router = useRouter();
  const { setIsLoading, setConfiguration } = useGlobalStore();
  const { showError } = useToast();

  const {
    switchToMap,
    updateSelectedLocations,
    resetMap,
    currentMap,
    isNewMap,
    selectedLocations,
  } = useVietnamMapStore();

  const handleChooseLocation = (location: LocationInfo) => {
    openMarkModal();
    setLocation(location);
  };

  const pinLocation = (location: LocationInfo) => {
    setOpen(false);
    updateSelectedLocations({
      ...location,
      status: "VISITED",
    });
  };

  const unpinLocation = (location: LocationInfo) => {
    setOpen(false);
    updateSelectedLocations({
      ...location,
      status: "NOT_VISITED",
    });
  };

  const uploadImages = async () => {
    const svgElement = document.getElementById("vietnam-map-svg");

    if (!svgElement) {
      alert("Không tìm thấy bản đồ SVG");
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
    setUrl(data.data.secure_url);
    setIsLoading(false);
  };

  const onShareModal = async () => {
    setIsLoading(true);
    setConfiguration({ description: "Đang tạo hình ảnh để chia sẻ" });
    try {
      await uploadImages();
      setModalName("share-modal");
      setOpen(true);
    } catch (error) {
      console.log(error);
      showError("Không thể thực hiện thao tác này");
    } finally {
      setIsLoading(false);
    }
  };

  const openMarkModal = () => {
    setModalName("mark-modal");
    setOpen(true);
  };

  const viewDetails = () => {
    router.push(`/details`);
  };

  const handleMarkUpcoming = (location: LocationInfo) => {
    setOpen(false);
    updateSelectedLocations({
      ...location,
      status: "UPCOMING",
    });
  };

  const navigateToCreateTravelPlan = () => {
    router.push("/lich-trinh");
  };

  return (
    <MainLayout>
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col justify-center items-center p-5 text-gray-700 text-lg md:text-4xl">
          <div className="text-amber-600">
            {selectedLocations.filter((x) => x.status === "VISITED").length}/
            {currentMap.length}
          </div>
          <p className="text-sm md:text-xl">Tỉnh/thành phố</p>
        </div>
        <div className="flex flex-col justify-center items-center p-5 text-gray-700 text-lg md:text-4xl">
          <div className="text-amber-600">
            {Math.round(
              (selectedLocations.filter((x) => x.status === "VISITED").length *
                100) /
                currentMap.length,
            )}
            %
          </div>
          <p className="text-sm md:text-xl">Việt Nam</p>
        </div>
        <div className="space-y-1 p-5">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: "#BB4D00" }}
            ></div>
            <span className="text-gray-600 text-xs md:text-sm">Đã đến</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: "#836FFF" }}
            ></div>
            <span className="text-gray-600 text-xs md:text-sm">Sắp đến</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: "#FE9A00" }}
            ></div>
            <span className="text-gray-600 text-xs md:text-sm">Chưa đến</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-end gap-2 px-3 w-full">
          {selectedLocations.length > 0 && (
            <>
              <Tooltip title="Xem chi tiết">
                <button
                  onClick={viewDetails}
                  className="hidden flex items-center gap-2 bg-white hover:bg-amber-50 px-4 border border-amber-500 rounded-md h-10 text-amber-500 hover:text-amber-600 text-xs md:text-sm cursor-pointer icon"
                >
                  Xem chi tiết
                </button>
              </Tooltip>
              /* {selectedLocations.filter((x) => x.status === "UPCOMING").length >
                0 && (
                <Tooltip title="Tạo lịch trình">
                  <button
                    onClick={navigateToCreateTravelPlan}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                  >
                    <MapPinned className="w-4 md:w-5 h-4 md:h-5" /> Tạo lịch
                    trình
                  </button>
                </Tooltip>
              )} */
              <Tooltip title="Tạo hình ảnh để chia sẻ">
                <button
                  onClick={onShareModal}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                >
                  <Share2 className="w-4 md:w-5 h-4 md:h-5" /> Chia sẻ
                </button>
              </Tooltip>
              <Tooltip title="Khôi phục">
                <button
                  onClick={resetMap}
                  className="flex items-center gap-2 bg-white hover:bg-amber-50 px-4 border border-amber-500 rounded-md h-8 md:h-10 text-amber-500 hover:text-amber-600 text-xs md:text-sm cursor-pointer icon"
                >
                  <RotateCw className="w-4 md:w-5 h-4 md:h-5" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
        <MapViewer
          locations={selectedLocations}
          onChoose={(location) => handleChooseLocation(location)}
        />
      </div>

      <Dialog open={open} keepMounted>
        <div className="flex justify-between items-center p-5 dialog-header">
          <h3 className="font-medium text-lg">
            {modalName === "mark-modal" ? "Địa điểm" : "Chia sẻ hành trình"}
          </h3>
          <button
            className="text-gray-600 cursor-pointer"
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
