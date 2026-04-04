"use client";

import { useState, useEffect, useCallback } from "react";

import TBMainLayout from "@/app/components/layout/TBMainLayout";
import TBTabs, { type TBTab } from "@/app/components/ui/TBTabs";
import TbItineraryLocation from "@/app/components/Itinerary/TbItineraryLocation";
import type { ItineraryLocation as TBDestinationV2Model } from "@/app/components/Itinerary/TbItineraryLocation";
import TBButton from "@/app/components/ui/TBButton";
import { Utils } from "@/app/libs/utils";
import { InputAdornment, Paper, Skeleton } from "@mui/material";
import TBInput from "@/app/components/ui/TBInput";
import { Calendar1, Save } from "lucide-react";
import { Box, Stack, Typography } from "@mui/material";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import _ from "lodash";
import { HttpClient } from "@/app/libs/api/axios";
import { API_URLS } from "@/app/libs/api/api.constant";
import { useParams, useRouter } from "next/navigation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DATE_FORMAT } from "@/app/libs/constants";
import dynamic from "next/dynamic";

type TBTripData = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  accessCode: string;
  isPrivate: boolean;
  canView?: boolean;
  schedule?: TBTripDay[];
};

type TBTripDay = {
  day: number;
  destinations: TBDestinationV2Model[];
};

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

type TBSetupSiteProps = {
  tripData: TBTripData | null;
  onSetupSiteChange?: (data: TBTripData) => void;
  handleStepChange?: (step: number) => void;
};

function TBSetUpSite({ tripData, onSetupSiteChange }: TBSetupSiteProps) {
  const { showError } = useToast();

  const handleChange = (key: keyof TBTripData, value: any) => {
    if (!tripData) return;
    onSetupSiteChange?.({
      ...tripData,
      [key]: value,
    });
  };

  const [isChangeName, setIsChangeName] = useState<boolean>(false);

  return (
    <Paper
      sx={{
        mt: "20px !important",
        backgroundColor: "background.paper",
        p: 4,
      }}
    >
      {!isChangeName && (
        <Stack spacing={2}>
          <Box sx={{ display: "flex", minWidth: 0 }}>
            {tripData?.title ? (
              <Typography
                variant="h4"
                component="h4"
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {tripData.title}
              </Typography>
            ) : (
              <Skeleton width={200} />
            )}

            {/* <TBIconButton type="button" onClick={() => setIsChangeName(true)}>
              <Pencil size={16} />
            </TBIconButton> */}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Calendar1 size={16} />
            {tripData?.startDate && tripData?.endDate ? (
              <Typography variant="body1" component="h5">
                {dayjs(tripData.startDate).format(DATE_FORMAT)} -{" "}
                {dayjs(tripData.endDate).format(DATE_FORMAT)}
              </Typography>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Skeleton width={100} /> - <Skeleton width={100} />
              </Stack>
            )}
          </Box>
        </Stack>
      )}

      {isChangeName && (
        <Stack spacing={5}>
          <TBInput
            label="Tên hành trình"
            type="text"
            value={tripData?.title || ""}
            size="medium"
            variant="standard"
            required
            onChange={(e) =>
              handleChange("title", (e.target as HTMLInputElement)?.value || "")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!tripData?.title.trim()) {
                  showError("Tên hành trình không được để trống");
                  return;
                }
                setIsChangeName(false);
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    sx={{
                      cursor: "pointer",
                    }}
                    position="end"
                    onClick={() => {
                      if (!tripData?.title.trim()) {
                        showError("Tên hành trình không được để trống");
                        return;
                      }
                      setIsChangeName(false);
                    }}
                  >
                    <Save size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack flexDirection="row" alignItems="center" gap={2}>
            <DatePicker
              label="Ngày bắt đầu"
              slotProps={{ textField: { size: "small", required: true } }}
              defaultValue={dayjs(tripData?.startDate)}
              onChange={(value: Dayjs | null) => {
                const isBeforeToday = value?.isBefore(dayjs());
                if (isBeforeToday) {
                  showError("Ngày bắt đầu không được trước ngày hiện tại");
                  return;
                }
                handleChange("startDate", value?.format(DATE_FORMAT) || "");
              }}
              format={DATE_FORMAT}
            />
            đến
            <DatePicker
              label="Ngày kết thúc"
              slotProps={{ textField: { size: "small", required: true } }}
              defaultValue={dayjs(tripData?.startDate).add(1, "day")}
              onChange={(value: Dayjs | null) => {
                if (!value) return;
                const start = dayjs(tripData?.startDate, DATE_FORMAT);

                if (value.isBefore(start, "day")) {
                  showError("Ngày kết thúc không được trước ngày bắt đầu");
                  return;
                }
                handleChange("endDate", value?.format(DATE_FORMAT) || "");
              }}
              format={DATE_FORMAT}
            />
          </Stack>
        </Stack>
      )}
    </Paper>
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
          <Box
            sx={{
              mt: 4,
              borderRadius: 1,
              border: "2px dashed",
              borderColor: "primary.main",
              height: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "background.paper",
            }}
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
          </Box>
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
  const params = useParams();
  const id = params.id;
  const [tripData, setTripData] = useState<TBTripData | null>(null);

  const [schedule, setSchedule] = useState<TBTripDay[]>([
    { day: 1, destinations: [] },
  ]);

  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await HttpClient.post<TBTripData>(API_URLS.plan + "/" + id);
      if (!data) return;
      const { schedule, canView, ...rest } = data;
      setTripData(data);
      if (schedule && !!schedule?.length) {
        console.log("empty schedule");
        setSchedule(schedule);
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async () => {
    try {
      if (!tripData?.title) {
        showError("Bạn chưa đặt tên cho lịch trình");
        return;
      }

      if (schedule.every((sh) => !sh.destinations.length)) {
        showError("Lịch trình chưa được lập");
        return;
      }

      setIsLoading(true);

      const cleanedTrip = _.omit(tripData, ["objectId"]);

      const cleanedSchedule = schedule.map((day) => ({
        ...day,
        destinations: day.destinations.map((dest) => ({
          ..._.omit(dest, ["objectId"]),
          experiences: dest.experiences.map((act) => _.omit(act, ["objectId"])),
        })),
      }));

      console.log({
        ...tripData,
        schedule: cleanedSchedule,
      });

      // const data = await HttpClient.post<ResponseId>(API_URLS.plan, {
      //   ...tripData,
      //   schedule: cleanedSchedule,
      // });

      // router.push("/lich-trinh/" + data.id);
      // showSuccess("Tạo hành trình thành công");
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
      //
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id, fetchPlan]);

  return (
    <TBMainLayout hideButton>
      <Stack spacing={4}>
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
