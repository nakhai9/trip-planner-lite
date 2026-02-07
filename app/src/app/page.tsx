"use client";

import React from "react";

import { Dialog, Tooltip } from "@mui/material";
import MapViewer from "./components/MapViewer";
import { Flag, Footprints, Map, Pin, PinOff, Share2, X } from "lucide-react";
import { LocationInfo } from "./model";
import { useVietnamMapStore } from "./store/vietnam-map-store";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import SocialShare from "./components/SocialShare";
import { useGlobalStore } from "./store/global-store";

export default function Home() {
  const [location, setLocation] = React.useState<LocationInfo | null>(null);
  const [selectedLocationIds, setSelectedLocationIds] = React.useState<
    string[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("https://example.com");
  const [isViewDetails, setIsViewDetails] = React.useState(false);
  const [modalName, setModalName] = React.useState<string | null>(null);
  const router = useRouter();
  const { setIsLoading, setConfiguration } = useGlobalStore();

  const { switchToMap, setVisitedLocations, loading, currentMap, isNewMap } =
    useVietnamMapStore();

  const handleChooseLocation = (location: LocationInfo) => {
    openMarkModal();
    setLocation(location);
  };

  const pinLocation = (location: LocationInfo) => {
    setOpen(false);

    setSelectedLocationIds((prev) =>
      prev.includes(location.codeName) ? prev : [...prev, location.codeName],
    );
    setVisitedLocations([...selectedLocationIds, location.codeName]);
  };

  const unpinLocation = (location: LocationInfo) => {
    setOpen(false);
    setSelectedLocationIds((prev) =>
      prev.filter((x) => x !== location.codeName),
    );
  };

  const onSwitchToMap = () => {
    switchToMap();
    setSelectedLocationIds([]);
  };

  const hasVisited = (codeName: string) => {
    return selectedLocationIds.includes(codeName);
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

    const res = await fetch("https://govietnam.onrender.com", {
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
    await uploadImages();
    setModalName("share-modal");
    setOpen(true);
  };

  const openMarkModal = () => {
    setModalName("mark-modal");
    setOpen(true);
  };

  const viewDetails = () => {
    router.push(`/details`);
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden font-sans">
      <div className="top-0 z-50 fixed flex bg-white w-full">
        <div className="flex justify-between items-center bg-white mx-auto w-5xl h-14">
          <h1 className="font-medium text-amber-600 text-3xl">GoVietnam</h1>
          <div className="flex gap-4">
            {!selectedLocationIds.length && (
              <button
                className={clsx(
                  "flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-10 text-white text-xs md:text-sm icon",
                  selectedLocationIds.length > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer",
                )}
                type="button"
                onClick={onSwitchToMap}
                disabled={selectedLocationIds.length > 0}
              >
                <Map />{" "}
                <div>
                  Xem bản đồ{" "}
                  <span className="font-semibold">
                    {isNewMap ? "trước" : "sau"}
                  </span>{" "}
                  sáp nhập
                </div>
              </button>
            )}
            {selectedLocationIds.length > 0 && (
              <>
                <Tooltip title="Xem chi tiết">
                  <button
                    onClick={viewDetails}
                    className="flex items-center gap-2 bg-white hover:bg-amber-50 px-4 border border-amber-500 rounded-md h-10 text-amber-500 hover:text-amber-600 text-xs md:text-sm cursor-pointer icon"
                  >
                    Xem chi tiết
                  </button>
                </Tooltip>
                <Tooltip title="Tạo hình ảnh để chia sẻ">
                  <button
                    onClick={onShareModal}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-10 text-white text-xs md:text-sm cursor-pointer"
                  >
                    <Share2 /> Chia sẻ hành trình này
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>
      <main className="mx-auto mt-14 w-full md:w-5xl">
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-center p-5 text-gray-700 text-lg md:text-4xl">
            <div className="text-amber-600">
              {selectedLocationIds.length}/{currentMap.length}
            </div>
            <p className="text-sm md:text-xl">Tỉnh/thành phố</p>
          </div>
          <div className="flex flex-col justify-center items-center p-5 text-gray-700 text-lg md:text-4xl">
            <div className="text-amber-600">
              {Math.round(
                (selectedLocationIds.length * 100) / currentMap.length,
              )}
              %
            </div>
            <p className="text-sm md:text-xl">Việt Nam</p>
          </div>
        </div>
        <div className="">
          <MapViewer
            locationIds={selectedLocationIds}
            onChoose={(location) => handleChooseLocation(location)}
            loading={loading}
          />
        </div>
      </main>

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
            <>
              <div className="mb-4 font-medium text-lg text-center">
                {location?.name ?? "-"}
              </div>
              <div className="flex justify-around gap-4">
                <button
                  onClick={() => pinLocation(location as LocationInfo)}
                  className={clsx(
                    `flex flex-col justify-center items-center gap-2 cursor-pointer`,
                    hasVisited(location?.codeName as string)
                      ? "text-[#FE9A00]"
                      : "",
                  )}
                >
                  <Flag />
                  <p>Đã đến</p>
                </button>
                <button
                  onClick={() => unpinLocation(location as LocationInfo)}
                  className="flex flex-col justify-center items-center gap-2 cursor-pointer"
                >
                  <PinOff />
                  <p>Tháo ghim</p>
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="hidden flex flex-col justify-center items-center gap-2 cursor-pointer"
                >
                  <Footprints />
                  <p>Sắp đến</p>
                </button>
              </div>
            </>
          )}

          {modalName === "share-modal" && <SocialShare url={url} />}
        </div>
      </Dialog>
    </div>
  );
}
