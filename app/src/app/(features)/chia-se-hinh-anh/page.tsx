"use client";

import { LocationInfo } from "@/app/model";
import TbMainLayout from "@/components/layout/TbMainLayout";
import TbMapViewer from "@/components/TbMapViewer";
import TbSocialShare from "@/components/TbSocialShare";
import TbButton from "@/components/ui/TbButton";
import TbIconButton from "@/components/ui/TbIconButton";
import { API_URLS } from "@/libs/api/api.constant";
import { HttpClient } from "@/libs/api/http";
import { useGlobalStore, useToast } from "@/store/global-store";
import { useVietnamMapStore } from "@/store/vietnam-map-store";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
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

export default function TBChiaSeHinhAnhPage() {
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
  }, [resetSelectedLocationsToShare]);

  const updatePlanImages = async (url: string, userId?: string) => {
    await HttpClient.post<{ url: string; userId?: string }>(
      API_URLS.planImage,
      { url, userId },
    );
  };

  const visitedColor = "#FE9A00";
  const upcomingColor = "#836FFF";

  return (
    <TbMainLayout hideButton={false}>
      <Stack sx={{ mt: 10, px: { xs: 2, md: 0 } }}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          flexWrap="wrap"
        >
          {selectedLocationsToShare.filter((x) => x.status === "UPCOMING")
            .length > 0 && (
            <Tooltip title="Tạo lịch trình">
              <TbButton
                onClick={() => navigateToPage("/lich-trinh")}
                sx={{
                  "& svg": {
                    width: { xs: 16, md: 20 },
                    height: { xs: 16, md: 20 },
                  },
                }}
                leftIcon={<MapPinned />}
              >
                Tạo lịch trình
              </TbButton>
            </Tooltip>
          )}
          {selectedLocationsToShare.length > 0 && (
            <>
              <Tooltip title="Tạo hình ảnh để chia sẻ">
                <TbButton
                  onClick={onShareModal}
                  sx={{
                    "& svg": {
                      width: { xs: 16, md: 20 },
                      height: { xs: 16, md: 20 },
                    },
                  }}
                  leftIcon={<Share2 />}
                >
                  Chia sẻ lên mạng xã hội
                </TbButton>
              </Tooltip>
              <Tooltip title="Khôi phục">
                <TbButton
                  variant="outline"
                  onClick={resetSelectedLocationsToShare}
                  sx={{
                    minWidth: 48,
                    "& svg": {
                      width: { xs: 16, md: 20 },
                      height: { xs: 16, md: 20 },
                    },
                  }}
                  leftIcon={<RotateCw />}
                />
              </Tooltip>
            </>
          )}
        </Stack>
        <TbMapViewer
          locations={selectedLocationsToShare}
          onChoose={(location) => handleChooseLocation(location)}
        />
      </Stack>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        keepMounted
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={500} variant="subtitle1">
            {modalName === "mark-modal" ? "Địa điểm" : "Chia sẻ hành trình"}
          </Typography>
          <TbIconButton
            sx={{ color: "grey.700" }}
            onClick={() => setOpen(false)}
            aria-label="Đóng"
          >
            <X />
          </TbIconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: 224 }}>
          {modalName === "mark-modal" && (
            <Stack sx={{ maxWidth: { xs: 192, md: 256 }, mx: "auto" }}>
              <Typography
                variant="h5"
                fontWeight={500}
                textAlign="center"
                sx={{ mb: 2 }}
              >
                {location?.name ?? "-"}
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={{ xs: 3, md: 5 }}
              >
                {location?.status !== "UPCOMING" && (
                  <Stack
                    component="button"
                    type="button"
                    spacing={1}
                    alignItems="center"
                    onClick={() => pinLocation(location as LocationInfo)}
                    sx={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      p: 0,
                      color:
                        location?.status === "VISITED"
                          ? visitedColor
                          : "inherit",
                    }}
                  >
                    <Flag />
                    <Typography variant="caption">Đã đến</Typography>
                  </Stack>
                )}
                {location?.status !== "VISITED" && (
                  <Stack
                    component="button"
                    type="button"
                    spacing={1}
                    alignItems="center"
                    onClick={() => handleMarkUpcoming(location as LocationInfo)}
                    sx={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      p: 0,
                      color:
                        location?.status === "UPCOMING"
                          ? upcomingColor
                          : "inherit",
                    }}
                  >
                    <Footprints />
                    <Typography variant="caption">Sắp đến</Typography>
                  </Stack>
                )}

                {location?.status && location?.status !== "NOT_VISITED" && (
                  <Stack
                    component="button"
                    type="button"
                    spacing={1}
                    alignItems="center"
                    onClick={() => unpinLocation(location as LocationInfo)}
                    sx={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      p: 0,
                    }}
                  >
                    <PinOff />
                    <Typography variant="caption">Tháo ghim</Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}

          {modalName === "share-modal" && <TbSocialShare url={url} />}
        </DialogContent>
      </Dialog>
    </TbMainLayout>
  );
}
