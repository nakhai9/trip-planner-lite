"use client";

import TbItinerary from "@/components/Itinerary/TbItinerary";
import TbMainLayout from "@/components/layout/TbMainLayout";
import TbButton from "@/components/ui/TbButton";
import TbInput from "@/components/ui/TbInput";
import TbTabs, { TbTab } from "@/components/ui/TbTabs";
import { API_URLS } from "@/libs/api/api.constant";
import { HttpClient } from "@/libs/api/http";
import { DATE_FORMAT } from "@/libs/constants";
import { NOOP_FNC, Utils, watch } from "@/libs/utils";
import { useGlobalStore, useToast } from "@/store/global-store";
import { ResponseId } from "@/types/api";
import { ObjectId, Plan, Itinerary } from "@/types/common";
import {
  Box,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import _ from "lodash";
import { Calendar1, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

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

  itinerariesSite: {
    sectionTitle: {
      my: 3,
      fontWeight: 400,
    },
    list: {
      mt: 4,
    },
  },
};

type TbPlanInfoSiteProps = {
  plan: Plan | null;
  onPlanInfoChange?: (data: Plan) => void;
  handleStepChange?: (step: number) => void;
};

function TBPlanInfoSite({ plan, onPlanInfoChange }: TbPlanInfoSiteProps) {
  const { showError } = useToast();

  const handleChange = (key: keyof Plan, value: any) => {
    if (!plan) return;
    onPlanInfoChange?.({
      ...plan,
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
            {plan?.title ? (
              <Typography
                variant="h4"
                component="h4"
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {plan.title}
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
            {plan?.startDate && plan?.endDate ? (
              <Typography variant="body1" component="h5">
                {dayjs(plan.startDate).format(DATE_FORMAT)} -{" "}
                {dayjs(plan.endDate).format(DATE_FORMAT)}
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
          <TbInput
            label="Tên hành trình"
            type="text"
            value={plan?.title || ""}
            size="medium"
            variant="standard"
            required
            onChange={(e) =>
              handleChange("title", (e.target as HTMLInputElement)?.value || "")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!plan?.title.trim()) {
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
                      if (!plan?.title.trim()) {
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
              defaultValue={dayjs(plan?.startDate)}
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
              defaultValue={dayjs(plan?.startDate).add(1, "day")}
              onChange={(value: Dayjs | null) => {
                if (!value) return;
                const start = dayjs(plan?.startDate, DATE_FORMAT);

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

type TbItinerariesSiteProps = {
  itineraries: Itinerary[];
  onItinerariesChange: (itineraries: Itinerary[]) => void;
  handleStepChange?: (step: number) => void;
};

function TbItinerariesSite({
  itineraries = [],
  onItinerariesChange: onItineraryChange,
}: TbItinerariesSiteProps) {
  const { showError } = useToast();
  const [tabs, setTabs] = useState<TbTab[]>([{ key: "1", title: "Ngày 1" }]);

  const [currentTab, setCurrentTab] = useState<TbTab>({
    key: "1",
    title: "Ngày 1",
  });

  const handleItineraryChange = (
    itineraryInfo: Itinerary,
    action: "UPDATE" | "DELETE",
  ) => {
    const updated = itineraries.map((it) => {
      if (it.objectId !== itineraryInfo.objectId) return it;

      if (action === "DELETE") {
        return {
          ...it,
          destination: {
            codeName: "UNSET",
            name: "UNSET",
          },
        };
      }

      return {
        ...it,
        ...itineraryInfo,
      };
    });

    onItineraryChange(updated);
  };

  const handleAddStep = () => {
    // onItineraryChange();
  };

  return (
    <>
      <Stack spacing={4} sx={{ my: 5 }}>
        <Box>
          <TbTabs
            tabs={tabs}
            current={currentTab}
            onChooseTab={(tab) => setCurrentTab(tab)}
            onAdd={() => handleAddStep}
          />
        </Box>

        <TbItinerary
          itinerary={
            itineraries.find((x) => x.day === Number(currentTab.key)) || {
              day: Number(currentTab.key),
              destination: { codeName: "UNSET", name: "UNSET" },
              activities: [],
            }
          }
          onItineraryChange={(itinerary) =>
            handleItineraryChange(itinerary, "UPDATE")
          }
          onDelete={(itinerary) => handleItineraryChange(itinerary, "DELETE")}
        />
      </Stack>
    </>
  );
}

export default function TBTripBuilderPage() {
  const { showError, showSuccess } = useToast();
  const { setIsLoading } = useGlobalStore();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [plan, setPlan] = useState<Plan | null>(null);

  const [itineraries, setItineraries] = useState<Itinerary[]>([
    {
      day: 1,
      destination: { codeName: "UNSET", name: "UNSET" },
      activities: [],
      objectId: Utils.random.uuid(),
    },
  ]);

  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await HttpClient.post<Plan>(API_URLS.plan + "/" + id);
      if (!data) return;
      setPlan(data);
    } catch (error) {
      showError(error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async () => {
    try {
      if (!plan?.title) {
        showError("Bạn chưa đặt tên cho lịch trình");
        return;
      }
      if (itineraries.every((x) => x.destination.codeName === "UNSET")) {
        showError("Lịch trình chưa được lập");
        return;
      }
      setIsLoading(true);

      const cleanedItineraries = _.map(itineraries, (item) => ({
        ..._.omit(item, ["objectId"]),
        activities: _.map(item.activities, (act) => _.omit(act, ["objectId"])),
      }));

      const payload = {
        planId: id,
        itineraries: cleanedItineraries,
      };
      console.log(payload);
      const data = await HttpClient.post<ResponseId>(
        API_URLS.planItinerary,
        payload,
      );
      router.push("/");
      showSuccess("Cập nhật hành trình thành công");
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
    <TbMainLayout hideButton>
      <Stack spacing={4}>
        <TBPlanInfoSite plan={plan} onPlanInfoChange={setPlan} />
        <TbItinerariesSite
          itineraries={itineraries}
          onItinerariesChange={(itineraries) => {
            setItineraries(itineraries);
          }}
        />
        <TbButton
          type="button"
          onClick={handleSave}
          disabled={itineraries.every(
            (x) => x.destination.codeName === "UNSET",
          )}
        >
          Lưu
        </TbButton>
      </Stack>
    </TbMainLayout>
  );
}
