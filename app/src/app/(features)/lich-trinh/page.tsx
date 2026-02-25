"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Bot,
  CirclePlus,
  Lightbulb,
  MapPin,
  Trash,
  Trash2,
  X,
} from "lucide-react";

import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import MainLayout from "@/app/ui/layout/MainLayout";
import { GeminiService } from "@/app/services/gemini";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { LocationInfo, Province } from "@/app/model";

import { useRouter } from "next/navigation";
import Tabs, { Tab } from "@/app/ui/tab";
import { HttpClient } from "@/app/libs/api/axios";
import { API_URLS } from "@/app/libs/api/api.constant";
import { Utils } from "@/app/libs/utils";
import clsx from "clsx";
import DestinationItem, { Destination } from "@/app/components/Destination";
import { ResponseId } from "@/app/libs/api/api.models";

type Schedule = {
  day: number;
  destinations: Destination[];
};

type Plan = {
  title?: string;
  startAt?: string;
  description?: string;
  destinations: Destination[];
};

export default function TravelPlan() {
  const router = useRouter();
  const {
    selectedLocations,
    updateSelectedLocations,
    resetMap,
    isNewMap,
    switchToMap,
  } = useVietnamMapStore();
  const { setIsLoading } = useGlobalStore();
  const { showError } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [plan, setPlan] = useState<Plan | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");

  const navigateToPage = (url?: string) => {
    if (!url) return;
    router.push(url);
  };

  const askGeminiToCreatePlan = async () => {
    setIsLoading(true, "Google Gemini đang tìm kiếm những gợi ý phù hợp...");
    try {
      if (!plan?.destinations?.length) return;
      const data = await GeminiService.askGeminiToCreatePlan(plan.destinations);
      if (data) {
        const result = JSON.parse(data);
        setPlan((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            destinations: result,
          };
        });
      }
    } catch (error: any) {
      showError(`Lỗi`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    try {
      setIsLoading(true);
      const data = await HttpClient.post<ResponseId>(API_URLS.plan, {
        ...plan,
        password: passcode || undefined,
        isPublic: !passcode.length && !isPrivate,
      });
      if (!data) return;
      navigateToPage(`/lich-trinh/${data.id}`);
    } catch (error) {
      showError("Lỗi không thể lưu");
    } finally {
      setIsLoading(false);
      initPlan();
      resetMap();
    }
  };

  const handleNextStep = (currentStep: number) => {
    setCurrentStep(currentStep);
    if (currentStep === 3) {
      updateDestinationInPlan();
    }
  };

  const onNamePlanChange = (e: any) => {
    if (!plan) return;
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        title: (e.target as HTMLInputElement)?.value,
      };
    });
  };

  const fetchProvinces = useCallback(async () => {
    setIsLoading(true);
    try {
      const provinces = await HttpClient.get<Province[]>(
        `${API_URLS.provinces}${isNewMap ? "?type=new" : "?type=old"}`,
      );
      setProvinces(provinces);
    } catch (error) {
      showError("Lỗi: Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, isNewMap]);

  useEffect(() => {
    if (!plan) {
      initPlan();
    }
    if (currentStep === 2) {
      fetchProvinces();
    }
  }, [fetchProvinces]);

  const initPlan = () => {
    setIsLoading(true);
    setPlan({
      title: "",
      destinations: [],
    });
    setIsLoading(false);
  };

  const updateDestinationInPlan = () => {
    setPlan((prev) => {
      if (!prev) return prev;
      const initialDestinations: Destination[] = selectedLocations.map((x) => ({
        activities: [],
        codeName: x.codeName,
        name: x.name,
        day: 1,
      }));
      return {
        ...prev,
        destinations: initialDestinations,
      };
    });
  };

  const handleActivityChange = (dest: Destination) => {
    if (plan) {
      setPlan((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          destinations: [
            ...prev.destinations.map((d) =>
              d.codeName === dest.codeName
                ? { ...d, activities: dest.activities }
                : d,
            ),
          ],
        };
      });
    }
  };

  const handleSelectChange = (dest: Destination) => {
    if (plan) {
      setPlan((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          destinations: [
            ...prev.destinations.map((d) =>
              d.codeName === dest.codeName ? { ...d, day: dest.day } : d,
            ),
          ],
        };
      });
    }
  };

  const handleDelete = (dest: Destination) => {
    setPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        destinations: [
          ...prev.destinations.filter((d) => d.codeName !== dest.codeName),
        ],
      };
    });
  };

  const handleSetPrivate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const handleFirstStep = () => {
    if (isPrivate) {
      if (!passcode.length) {
        showError("Bạn cần nhập mã bảo vệ khi chọn chế độ riêng tư");
        return;
      }

      if (passcode.length < 6) {
        showError("Mã bảo vệ tối đa 6 kí tự");
        return;
      }
    }

    handleNextStep(2);
  };

  return (
    <MainLayout hideButton>
      <div className="mt-20 md:p-0 px-4">
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 mx-auto p-4 md:p-0 w-full md:w-90">
            <div className="flex flex-col gap-2">
              <div>
                <label htmlFor="" className="block mb-2 text-xl text-center">
                  Hãy đặt tên cho lịch trình của bạn
                </label>
                <input
                  type="text"
                  placeholder="Đặt tên cho lịch trình của bạn"
                  className="px-2 border-2 border-amber-600 rounded-md outline-none w-full h-10"
                  onChange={(e) => onNamePlanChange(e)}
                  value={plan?.title || ""}
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox checked={isPrivate} onChange={handleSetPrivate} />
                }
                label="Chế độ riêng tư"
              />
              {isPrivate && (
                <div>
                  <label htmlFor="#passcode">
                    Mã bảo vệ <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="passcode"
                    type="password"
                    className="px-2 border-2 border-amber-600 rounded-md outline-none w-full h-10"
                    value={passcode || ""}
                    onChange={(e) =>
                      setPasscode((e.target as HTMLInputElement)?.value)
                    }
                  />
                </div>
              )}
              <div className="flex justify-end mt-2">
                {currentStep === 1 && plan?.title && (
                  <button
                    type="button"
                    onClick={handleFirstStep}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                  >
                    Tiếp theo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <label htmlFor="" className="block mb-2 text-xl text-center">
              Những nơi bạn muốn ghé đến
            </label>
            {!provinces.length ? (
              <span>Không có dữ liệu điểm đến</span>
            ) : (
              <div>
                {provinces.map((p) => (
                  <Chip
                    key={p.id}
                    label={p.name || ""}
                    className={clsx(
                      "!mr-2 !mb-2 !text-xs !md:text-sm",
                      selectedLocations.some(
                        (loc) => loc.codeName === p.codeName,
                      )
                        ? "!text-white !bg-[#836FFF] "
                        : "",
                    )}
                    onClick={() => {
                      updateSelectedLocations({
                        codeName: p.codeName,
                        name: p.name,
                        status: "UPCOMING",
                      });

                      updateDestinationInPlan();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="block mb-4 font-bold text-gray-700 text-xl md:text-4xl text-center word-wrap">
              {plan?.title || "Hành trình"}
            </h3>

            {!!plan?.destinations.length && (
              <div className="flex justify-center items-center">
                <Tooltip title="Hỏi AI">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 border border-amber-600 rounded-md h-8 md:h-10 text-amber-600 text-xs md:text-sm cursor-pointer"
                    onClick={askGeminiToCreatePlan}
                  >
                    <Lightbulb className="w-3 md:w-4 h-3 md:h-4" />
                    Gợi ý bởi Google Gemini
                  </button>
                </Tooltip>
              </div>
            )}

            <div className="gap-3 grid md:grid-cols-3 mt-3">
              {plan?.destinations.map((destination) => (
                <DestinationItem
                  key={destination.codeName}
                  destination={destination}
                  onActivityChange={(dest) => handleActivityChange(dest)}
                  onSelectChange={(dest) => handleSelectChange(dest)}
                  onDelete={(dest) => handleDelete(dest)}
                />
              ))}
            </div>

            {!!plan?.destinations.length && (
              <div className="flex justify-between my-3">
                <button
                  type="button"
                  onClick={() => handleNextStep(2)}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                >
                  Quay lại
                </button>
                <Tooltip title="Tạo lịch trình">
                  <button
                    type="button"
                    onClick={onSave}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                  >
                    Tạo lịch trình
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        )}

        <div className={clsx("flex justify-between items-center mt-2 actions")}>
          {currentStep === 2 && plan?.title && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleNextStep(1)}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
              >
                Quay lại
              </button>
              {!selectedLocations.length && (
                <button
                  type="button"
                  onClick={switchToMap}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                >
                  Danh sách {isNewMap ? 64 : 34} tỉnh/thành phố
                </button>
              )}
            </div>
          )}

          {currentStep === 2 && !!selectedLocations.length && plan?.title && (
            <button
              type="button"
              onClick={() => handleNextStep(3)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
            >
              Tiếp theo
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
