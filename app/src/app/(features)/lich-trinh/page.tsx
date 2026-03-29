"use client";

import React, { useState, useEffect } from "react";

import TBMainLayout from "@/app/components/layout/TBMainLayout";
import TBTabs, { type TBTab } from "@/app/components/ui/TBTabs";
import TbItineraryLocation from "@/app/components/Itinerary/TbItineraryLocation";
import type { ItineraryLocation as TBDestinationV2Model } from "@/app/components/Itinerary/TbItineraryLocation";
import TBButton from "@/app/components/ui/TBButton";
import { Utils } from "@/app/libs/utils";
import { Checkbox, FormControlLabel, IconButton, Paper } from "@mui/material";
import TBInput from "@/app/components/ui/TBInput";
import { ArrowLeft, Calendar1, Pencil, Sparkles } from "lucide-react";
import { Box, Stack, Typography } from "@mui/material";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import _ from "lodash";
import TBIconButton from "@/app/components/ui/TBIconButton";
import { HttpClient } from "@/app/libs/api/axios";
import { API_URLS } from "@/app/libs/api/api.constant";
import { useRouter } from "next/navigation";
import { ResponseId } from "@/app/libs/api/api.models";

const styles = {
  setupSite: {
    card: {
      p: 4,
      border: "1px solid #e0e0e0",
      backgroundColor: "background.paper",
    },
    title: {
      fontWeight: 400,
    },
    checkbox: {
      height: 10,
    },
  },

  scheduleSite: {
    sectionTitle: {
      my: 3,
      fontWeight: 400,
    },
    list: {
      mt: 4,
    },
  },
};

type TBTripData = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  accessCode: string;
  isPrivate: boolean;
};

type TBTripDay = {
  day: number;
  destinations: TBDestinationV2Model[];
};

type TBSetupSiteProps = {
  tripData: TBTripData;
  onSetupSiteChange?: (data: TBTripData) => void;
  handleStepChange?: (step: number) => void;
};

function TBSetUpSite({ tripData, onSetupSiteChange }: TBSetupSiteProps) {
  const { showError } = useToast();

  const handleChange = (key: keyof TBTripData, value: any) => {
    onSetupSiteChange?.({
      ...tripData,
      [key]: value,
    });
  };

  const [isChangeName, setIsChangeName] = useState<boolean>(false);

  return (
    <Box>
      {/* <Box sx={styles.setupSite.card}>
        <Stack spacing={6}>
          <Typography variant="h6" sx={styles.setupSite.title}>
            Hành trình chưa đặt tên
          </Typography>

          <TBInput
            type="text"
            placeholder="Đặt tên cho lịch trình của bạn"
            label="Lịch trình"
            required
            value={tripData.title ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("title", e.target.value ?? "")
            }
          />

          <TBInput
            type="date"
            label="Bắt đầu"
            value={tripData.startDate}
            required
            onChange={(e) =>
              handleChange("startDate", (e.target as HTMLInputElement)?.value)
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <FormControlLabel
            sx={styles.setupSite.checkbox}
            control={
              <Checkbox
                color="warning"
                checked={tripData.isPrivate}
                onChange={() => handleChange("isPrivate", !tripData.isPrivate)}
              />
            }
            label="Riêng tư"
          />

          {tripData.isPrivate && (
            <TBInput
              id="accessCode"
              type="password"
              label="Mã bảo vệ"
              required
              value={tripData.accessCode ?? ""}
              onChange={(e) =>
                handleChange(
                  "accessCode",
                  (e.target as HTMLInputElement)?.value,
                )
              }
            />
          )}

          <Stack direction="row" justifyContent="flex-end">
            <TBButton type="button" onClick={handleNextStep}>
              Tiếp theo
            </TBButton>
          </Stack>
        </Stack>
      </Box> */}
      <Paper sx={styles.setupSite.card}>
        <Stack spacing={3}>
          {!isChangeName ? (
            <Box sx={{ display: "flex", minWidth: 0 }}>
              <Typography
                variant="h6"
                component="h5"
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {tripData.title || "Hành trình đến (thay đổi)"}
              </Typography>
              <TBIconButton type="button" onClick={() => setIsChangeName(true)}>
                <Pencil size={16} />
              </TBIconButton>
            </Box>
          ) : (
            <Stack
              flexDirection="row"
              justifyContent="center"
              alignContent="center"
              spacing={2}
            >
              <TBInput
                type="text"
                value={tripData.title || ""}
                variant="standard"
                onChange={(e) =>
                  handleChange(
                    "title",
                    (e.target as HTMLInputElement)?.value || "",
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!tripData.title.trim()) {
                      showError("Tên hành trình không được để trống");
                      return;
                    }
                    setIsChangeName(false);
                  }
                }}
              />
            </Stack>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Calendar1 size={16} />
            <Typography variant="body2" component="h5">
              {tripData.startDate}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

type TBScheduleSiteProps = {
  schedule: TBTripDay[];
  onScheduleChange: (data: TBTripDay[]) => void;
  handleStepChange?: (step: number) => void;
};

function TBScheduleSite({
  schedule = [],
  onScheduleChange,
  handleStepChange,
}: TBScheduleSiteProps) {
  const { showError } = useToast();
  const [tabs, setTabs] = useState<TBTab[]>([{ key: "1", title: "Ngày 1" }]);

  const [currentTab, setCurrentTab] = useState<TBTab>({
    key: "1",
    title: "Ngày 1",
  });

  const currentDay = schedule.find((sh) => sh.day === Number(currentTab.key));

  const destinations = currentDay?.destinations || [];

  const updateDay = (day: number, updater: (d: TBTripDay) => TBTripDay) => {
    onScheduleChange?.(
      schedule.map((item) => (item.day === day ? updater(item) : item)),
    );
  };

  const handleAddTab = () => {
    const scheduleAtCurrentDay = schedule.find(
      (sh) => sh.day === Number(currentTab.key),
    );

    if (
      scheduleAtCurrentDay?.destinations.some((x) => x.codeName === "UNSET") ||
      !scheduleAtCurrentDay?.destinations.length
    ) {
      showError("Bạn cần lên lịch cho ngày hiện tại");
      return;
    }

    const nextDay = schedule.length + 1;

    const newTab = {
      key: nextDay.toString(),
      title: `Ngày ${nextDay}`,
    };

    setTabs((prev) => [...prev, newTab]);
    setCurrentTab(newTab);

    onScheduleChange([...schedule, { day: nextDay, destinations: [] }]);
  };

  const create = () => {
    const day = Number(currentTab.key);

    updateDay(day, (sh) =>
      sh.destinations.length === 0
        ? {
            ...sh,
            destinations: [
              {
                codeName: "UNSET",
                name: "",
                experiences: [],
                objectId: Utils.random.uuid(),
              },
            ],
          }
        : sh,
    );
  };

  const handleDestinationChange = (dest: TBDestinationV2Model, day: number) => {
    updateDay(day, (item) => ({
      ...item,
      destinations: [dest],
    }));
  };

  const handleDeleteDestination = (dest: { codeName: string }, day: number) => {
    updateDay(day, (item) => ({
      ...item,
      destinations: item.destinations.filter(
        (x) => x.codeName !== dest.codeName,
      ),
    }));
  };

  return (
    <>
      <Box sx={{ my: 5 }}>
        <TBTabs
          tabs={tabs}
          current={currentTab}
          onAdd={handleAddTab}
          onChooseTab={(tab) => setCurrentTab(tab)}
        />

        {destinations.length === 0 && (
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ mt: 10 }}
          >
            <TBButton variant="outline" type="button" onClick={create}>
              Thêm điểm đến
            </TBButton>
            {/* <TBButton
              variant="outline"
              type="button"
              onClick={create}
              leftIcon={<Sparkles size={14} />}
            >
              Đề xuất từ AI
            </TBButton> */}
          </Stack>
        )}

        <Stack spacing={2} sx={styles.scheduleSite.list}>
          {destinations.map((destination) => (
            <TbItineraryLocation
              key={destination.objectId || destination.id}
              destination={destination}
              onChangeDestination={(destination) =>
                handleDestinationChange(destination, Number(currentTab.key))
              }
              onDelete={(destination) =>
                handleDeleteDestination(destination, Number(currentTab.key))
              }
            />
          ))}
        </Stack>
      </Box>
    </>
  );
}

export default function TBTripBuilderPage() {
  const { showError, showSuccess } = useToast();
  const { setIsLoading } = useGlobalStore();
  const router = useRouter();
  const [tripData, setTripData] = useState<TBTripData>({
    title: "",
    description: "",
    startDate: Utils.date.getStartDate(),
    endDate: "",
    accessCode: "",
    isPrivate: false,
  });

  const [schedule, setSchedule] = useState<TBTripDay[]>([
    { day: 1, destinations: [] },
  ]);

  const handleSave = async () => {
    try {
      if (!tripData.title) {
        showError("Bạn chưa đặt tên cho lịch trình");
        return;
      }

      if (schedule.every((sh) => !sh.destinations.length)) {
        showError("Lịch trình chưa được lập");
        return;
      }

      resetState();
      setIsLoading(true);
      const cleanedTrip = _.omit(tripData, ["objectId"]);

      const cleanedSchedule = schedule.map((day) => ({
        ...day,
        destinations: day.destinations.map((dest) => ({
          ..._.omit(dest, ["objectId"]),
          activities: dest.experiences.map((act) => _.omit(act, ["objectId"])),
        })),
      }));

      const data = await HttpClient.post<ResponseId>(API_URLS.plan, {
        ...tripData,
        schedule: cleanedSchedule,
      });

      router.push("/lich-trinh/" + data.id);
      showSuccess("Tạo hành trình thành công");
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
      //
    }
  };

  const resetState = () => {
    setTripData({
      title: "",
      description: "",
      startDate: Utils.date.getStartDate(),
      endDate: "",
      accessCode: "",
      isPrivate: false,
    });
    setSchedule([]);
  };

  return (
    <TBMainLayout hideButton>
      <Stack mt={6} spacing={4}>
        <TBSetUpSite tripData={tripData} onSetupSiteChange={setTripData} />
        <TBScheduleSite
          schedule={schedule}
          onScheduleChange={(schedule) => {
            setSchedule(schedule);
          }}
        />
        <TBButton
          type="button"
          onClick={handleSave}
          disabled={schedule.every(
            (sh) =>
              !sh.destinations.length ||
              sh.destinations.some((d) => d.codeName === "UNSET"),
          )}
        >
          Lưu
        </TBButton>
      </Stack>
    </TBMainLayout>
  );
}
