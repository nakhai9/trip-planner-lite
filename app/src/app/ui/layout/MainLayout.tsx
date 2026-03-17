"use client";

import Modal from "@/app/components/Modal";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import clsx from "clsx";
import { Map, MapPinned } from "lucide-react";
import Toast from "../toast";
import { useRouter } from "next/navigation";
import Button from "../button";

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
  const { switchToMap, isNewMap, selectedLocationsToShare } =
    useVietnamMapStore();
  const router = useRouter();
  const onSwitchToMap = () => {
    setIsLoading(true, "Đang nạp dữ liệu bản đồ");
    switchToMap();
    setIsLoading(false);
  };
  return (
    <div className="relative flex flex-col min-h-screen font-sans">
      <div className="top-0 left-0 z-50 fixed flex bg-white shadow-md w-full">
        <div className="flex justify-center md:justify-between items-center gap-4 bg-white mx-auto px-4 md:px-0 w-full md:w-2xl lg:w-6xl h-14">
          <h1
            onClick={() => router.push("/")}
            className="block app-bg-primary p-2 md:px-2 md:py-0 font-medium app-text-white text-xl md:text-3xl md:text-left text-center italic cursor-pointer"
          >
            TripBuilder
          </h1>
          {!hideButton && (
            <div className="flex gap-4">
              {!selectedLocationsToShare.length && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={onSwitchToMap}
                  disabled={selectedLocationsToShare.length > 0}
                  className={clsx(
                    "icon",
                    selectedLocationsToShare.length > 0
                      ? "opacity-50 cursor-not-allowed"
                      : "",
                  )}
                  leftIcon={<Map className="w-4 md:w-5 h-4 md:h-5" />}
                >
                  <p>Bản đồ {isNewMap ? "mới" : "cũ"}</p>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <main className="mx-auto w-full w-full md:w-2xl lg:w-6xl">
        {children}
      </main>
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
