"use client";

import Modal from "@/app/components/Modal";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import clsx from "clsx";
import { Map, MapPinned } from "lucide-react";
import Toast from "../toast";
import { useRouter } from "next/navigation";

type MainLayoutProps = {
  children: React.ReactNode;
  hideButton?: boolean;
};

export default function MainLayout({
  children,
  hideButton = false,
}: MainLayoutProps) {
  const { isLoading, loadingMessage, setIsLoading } = useGlobalStore();
  const { message, isShow, type, hideToast } = useToast();
  const open = false;
  const { switchToMap, isNewMap, selectedLocations } = useVietnamMapStore();
  const router = useRouter();
  const onSwitchToMap = () => {
    setIsLoading(true, "Đang nạp dữ liệu bản đồ");
    switchToMap();
    setIsLoading(false);
  };
  return (
    <div className="relative flex flex-col min-h-screen font-sans">
      <div className="top-0 left-0 z-50 fixed flex bg-white shadow-md w-full">
        <div className="flex justify-center md:justify-between items-center gap-4 bg-white mx-auto px-4 md:px-0 w-full md:w-5xl h-14 cursor-pointer">
          <h1
            onClick={() => router.push("/")}
            className="block bg-amber-600 p-2 md:px-2 md:py-0 font-medium text-white text-xl md:text-3xl md:text-left text-center italic"
          >
            AroundVietnam
          </h1>
          {!hideButton && (
            <div className="flex gap-4">
              {!selectedLocations.length && (
                <button
                  className={clsx(
                    "flex items-center gap-2 hover:bg-amber-50 px-4 border border-amber-600 rounded-md h-8 md:h-10 text-amber-600 text-xs md:text-sm icon",
                    selectedLocations.length > 0
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer",
                  )}
                  type="button"
                  onClick={onSwitchToMap}
                  disabled={selectedLocations.length > 0}
                >
                  <Map className="w-4 md:w-5 h-4 md:h-5" />
                  <p>Xem bản đồ {isNewMap ? "mới" : "cũ"}</p>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <main className="mx-auto w-full md:w-5xl">{children}</main>
      {open && <Modal />}
      <Backdrop
        sx={{
          zIndex: 9999,
        }}
        open={isLoading}
      >
        <div className="flex flex-col items-center gap-4">
          <CircularProgress color="warning" />
          {loadingMessage && (
            <p className="px-4 text-white text-xs md:text-sm text-center">
              {loadingMessage}
            </p>
          )}
        </div>
      </Backdrop>
      <Toast
        isShow={isShow}
        message={message}
        type={type}
        onClose={hideToast}
      />
    </div>
  );
}
