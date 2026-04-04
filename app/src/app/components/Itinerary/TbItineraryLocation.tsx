"use client";

import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  CirclePlus,
  Map,
  MapPin,
  Pencil,
  PlusCircle,
  Trash2,
  TreePalm,
  X,
} from "lucide-react";
import TBIconButton from "../ui/TBIconButton";
import { useCallback, useRef, useState } from "react";
import { useGlobalStore, useToast } from "../../store/global-store";
import { useVietnamMapStore } from "../../store/vietnam-map-store";
import { Province } from "../../model";
import { HttpClient } from "../../libs/api/axios";
import { API_URLS } from "../../libs/api/api.constant";
import TbItineraryExperience, { Experience } from "./TbItineraryExperience";
import dynamic from "next/dynamic";

const TbOpenStreetMapView = dynamic(
  () => import("./../../components/TbOpenStreetMapView"),
  { ssr: false },
);
const styles = {
  paper: { width: "100%", overflow: "hidden" },
  headerSite: {
    py: 1,
    px: 5,
    borderBottom: "1px solid",
    borderColor: "primary.main",
  },

  inputsSite: { py: 3, px: 5 },

  actions: { display: "flex", justifyContent: "center", py: 2 },

  contentSite: {},

  locationTrigger: (hasActivities: boolean) => ({
    cursor: hasActivities ? "default" : "pointer",
    pointerEvents: hasActivities ? "none" : "auto",
  }),

  deleteBtn: { color: "error.main" },
  editBtn: { display: "none", bgcolor: "grey.100", color: "primary.main" },

  experienceItem: { borderLeft: 3, borderColor: "primary.main" },
  experienceSite: {
    width: "100%",
  },

  mapLink: { color: "info.main", cursor: "pointer" },
  deleteAction: { color: "error.main", fontSize: "0.75rem", cursor: "pointer" },

  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 2,
  },

  chip: { mr: 1, mb: 1 },
  chipSelected: { bgcolor: "primary.main", color: "primary.contrastText" },
};

type EmptySiteProps = {
  destination?: ItineraryLocation;
};

function EmptySite({ destination }: EmptySiteProps) {
  if (destination?.experiences.length) return;
  return (
    <Stack
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      py={3}
    >
      <TreePalm color="#e46767" size={40} />

      <Typography variant="body2" color="text.secondary" textAlign="center">
        Chưa có hoạt động
      </Typography>
    </Stack>
  );
}

function useProvinces() {
  const { setIsLoading } = useGlobalStore();
  const { showError } = useToast();
  const { isNewMap } = useVietnamMapStore();

  const [provinces, setProvinces] = useState<Province[]>([]);

  const fetchProvinces = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await HttpClient.get<Province[]>(
        `${API_URLS.provinces}${isNewMap ? "?type=new" : "?type=old"}`,
      );
      setProvinces(result);
    } catch {
      showError("Lỗi: Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [isNewMap, setIsLoading, showError]);

  return { provinces, fetchProvinces };
}

export type ItineraryLocation = {
  id?: string;
  codeName: "UNSET" | string;
  name: string;
  experiences: Experience[];
  objectId?: string;
};

export type TbItineraryLocationProps = {
  destination: ItineraryLocation;
  onChangeDestination?: (destination: ItineraryLocation) => void;
  onDelete?: (destination: ItineraryLocation) => void;
};

type TBDestinationV2ModalKey = "list" | "map";

export default function TbItineraryLocation({
  destination,
  onChangeDestination,
  onDelete,
}: TbItineraryLocationProps) {
  const [modalKey, setModalKey] = useState<TBDestinationV2ModalKey>("list");
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => setOpen(!open);
  const [showExperienceForm, setShowExperienceForm] = useState<boolean>(false);
  const { showError } = useToast();

  const [coordinate, setCoordinate] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  const { provinces, fetchProvinces } = useProvinces();

  const openProvinceList = () => {
    setModalKey("list");
    setOpen(true);
    fetchProvinces();
  };

  const handleDeleteItineraryLocation = (exp: Experience) => {
    onChangeDestination?.({
      ...destination,
      experiences: destination.experiences.filter(
        (x) => x.objectId !== exp.objectId,
      ),
    });
  };

  const handleItineraryExperienceChange = (data: Experience) => {
    setShowExperienceForm(false);
    onChangeDestination?.({
      ...destination,
      experiences: [...destination.experiences, data],
    });
  };

  return (
    <>
      {coordinate && (
        <TbOpenStreetMapView
          latitude={coordinate.latitude}
          longitude={coordinate.longitude}
        />
      )}
      <Paper elevation={3} sx={styles.paper}>
        <Box sx={styles.headerSite}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              onClick={
                !!destination.experiences.length ? undefined : openProvinceList
              }
              sx={styles.locationTrigger(!!destination.experiences.length)}
            >
              <MapPin size={18} />
              <Typography component="span">
                {destination.codeName === "UNSET"
                  ? "Địa chỉ (thay đổi)"
                  : destination.name}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              {destination.codeName !== "UNSET" && !showExperienceForm && (
                <TBIconButton
                  type="button"
                  onClick={() => setShowExperienceForm(true)}
                >
                  <PlusCircle size={18} />
                </TBIconButton>
              )}

              {onDelete && (
                <TBIconButton
                  onClick={() => onDelete(destination)}
                  sx={styles.deleteBtn}
                  type="button"
                >
                  <Trash2 size={18} />
                </TBIconButton>
              )}
            </Stack>
          </Stack>
        </Box>
        <Box sx={styles.contentSite}>
          {showExperienceForm && (
            <Box sx={styles.inputsSite}>
              <TbItineraryExperience
                onChange={(data) => handleItineraryExperienceChange(data)}
                onClickXButton={() => setShowExperienceForm(false)}
              />
            </Box>
          )}

          <EmptySite destination={destination} />

          {destination?.experiences.length > 0 && (
            <Stack spacing={2} px={4} py={4} sx={styles.experienceSite}>
              {destination.experiences.map((exp) => (
                <Stack
                  key={exp.objectId}
                  direction="row"
                  spacing={1}
                  pl={2}
                  sx={styles.experienceItem}
                >
                  <Stack sx={styles.experienceSite}>
                    <Typography variant="body2">{exp.name}</Typography>

                    <Stack direction="row" justifyContent="space-between">
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={styles.mapLink}
                        onClick={() => {
                          const coordinates = exp.coordinates;
                          if (!coordinates || coordinates.length !== 2) {
                            showError("Kinh độ và vĩ độ không hợp lệ");
                            return;
                          }

                          setCoordinate({
                            latitude: Number(coordinates[0]),
                            longitude: Number(coordinates[1]),
                          });
                        }}
                      >
                        <Map size={14} />
                        <Typography variant="caption">
                          {/* {exp.address || "Địa chỉ"} */}
                          Xem bản đồ
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        onClick={() => handleDeleteItineraryLocation(exp)}
                        sx={styles.deleteAction}
                      >
                        <Trash2 size={14} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      <Dialog open={open} onClose={toggleModal} maxWidth="lg" fullWidth>
        <DialogTitle sx={styles.dialogTitle}>
          <Typography component="span">
            {modalKey === "list" ? "Tỉnh/thành phố tại Việt Nam" : "Xem bản đồ"}
          </Typography>
          <TBIconButton onClick={toggleModal}>
            <X />
          </TBIconButton>
        </DialogTitle>

        <DialogContent dividers>
          {modalKey === "list" && (
            <Box sx={{ py: 2 }}>
              {provinces.map((p) => (
                <Chip
                  key={p.id}
                  label={p.name}
                  sx={{
                    ...styles.chip,
                    ...(destination?.codeName === p.codeName
                      ? styles.chipSelected
                      : {}),
                  }}
                  onClick={() => {
                    toggleModal();
                    onChangeDestination?.({
                      ...destination,
                      name: p.name,
                      codeName: p.codeName,
                    });
                  }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
