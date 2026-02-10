"use client";

import Modal from "@/app/components/Modal";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import clsx from "clsx";
import { Map, MapPinned } from "lucide-react";
import Toast from "../toast";

type MainLayoutProps = {
  children: React.ReactNode;
  hideButton?: boolean;
};

export default function MainLayout({
  children,
  hideButton = false,
}: MainLayoutProps) {
  const { isLoading, description, setIsLoading, setConfiguration } =
    useGlobalStore();
  const { message, isShow, type, hideToast } = useToast();
  const open = false;
  const { switchToMap, isNewMap, selectedLocations } = useVietnamMapStore();

  const onSwitchToMap = () => {
    setIsLoading(true);
    setConfiguration({ description: "Đang nạp dữ liệu bản đồ" });
    switchToMap();
    setIsLoading(false);
  };
  return (
    <div className="relative flex flex-col min-h-screen font-sans">
      <div className="top-0 left-0 z-50 fixed flex bg-white w-full">
        <div className="flex justify-between items-center bg-white mx-auto px-4 md:px-0 w-full md:w-5xl h-14">
          <h1 className="font-medium text-amber-600 text-xl md:text-3xl">
            GoVietnam
          </h1>
          <div className="flex gap-4">
            {!hideButton && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
      <main className="mx-auto mt-5 w-full md:w-5xl">{children}</main>
      {open && <Modal />}
      <Backdrop
        sx={{
          zIndex: 9999,
        }}
        open={isLoading}
      >
        <div className="flex flex-col items-center gap-4">
          <CircularProgress color="warning" />
          {description && (
            <p className="px-4 text-white text-center">{description}</p>
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
