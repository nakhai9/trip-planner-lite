"use client";

import React from "react";
import { Tooltip } from "@mui/material";
import { Bot, CirclePlus, MapPin, Trash, Trash2, X } from "lucide-react";

import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import MainLayout from "@/app/ui/layout/MainLayout";
import { GeminiService } from "@/app/services/gemini";
import { useGlobalStore, useToast } from "@/app/store/global-store";
import { Utils } from "@/app/common/utils";
import { LocationInfo } from "@/app/model";

type Plan = {
  title?: string;
  startAt?: string;
  description?: string;
  locations: {
    locationName: string;
    activities: string[];
  }[];
};

export default function TravelPlan() {
  const { selectedLocations, updateSelectedLocations } = useVietnamMapStore();
  const { isLoading, setIsLoading } = useGlobalStore();
  const { showError } = useToast();

  const [plan, setPlan] = React.useState<Plan>({
    title: "demo",
    locations: [],
  });

  // lưu input theo từng location
  const [inputs, setInputs] = React.useState<Record<string, string>>({});

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    codeName: string,
  ) => {
    setInputs((prev) => ({
      ...prev,
      [codeName]: e.target.value,
    }));
  };

  const onAdd = (codeName: string) => {
    const action = inputs[codeName]?.trim();
    if (!action) return;
    setPlan((prev: Plan) => {
      const existed = prev.locations.find((m) => m.locationName === codeName);
      if (existed) {
        return {
          ...prev,
          locations: prev.locations.map((m) =>
            m.locationName === codeName
              ? {
                  ...m,
                  activities: [...m.activities, action],
                }
              : m,
          ),
        };
      }
      return {
        ...prev,
        locations: [
          ...prev.locations,
          {
            locationName: codeName,
            activities: [action],
          },
        ],
      };
    });
    // clear input sau khi add
    setInputs((prev) => ({ ...prev, [codeName]: "" }));
  };

  const onDelete = (codeName: string, action: string) => {
    setPlan((prev) => ({
      ...prev,
      locations: prev.locations.map((m) =>
        m.locationName === codeName
          ? {
              ...m,
              actionsAtLocation: m.activities.filter((a) => a !== action),
            }
          : m,
      ),
    }));
  };

  const askGeminiToCreatePlan = async () => {
    setIsLoading(true, "Vui lòng chờ một chút, đề xuất đang được tạo...");
    try {
      const data = await GeminiService.askGeminiToCreatePlan(selectedLocations);
      if (data) {
        const result = JSON.parse(data);
        setPlan((prev: Plan) => ({
          ...prev,
          locations: result,
        }));
      }
    } catch (error: any) {
      showError(`Lỗi`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = (location: LocationInfo) => {
    updateSelectedLocations({ ...location, status: "NOT_VISITED" });
  };

  return (
    <MainLayout hideButton>
      <div className="mt-8 md:p-0 px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium text-gray-700 text-xl">
            Lịch trình sắp đến
          </div>

          <div className="flex items-center gap-2">
            <Tooltip title="Hỏi AI">
              <button
                type="button"
                className="flex items-center gap-2 px-4 border border-amber-600 rounded-md h-8 md:h-10 text-amber-600 text-xs md:text-sm cursor-pointer"
                onClick={askGeminiToCreatePlan}
              >
                Gợi ý <Bot />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {!!selectedLocations.length &&
            selectedLocations
              .filter((loc) => loc.status === "UPCOMING")
              .map((x) => {
                const actions =
                  plan.locations.find((p) => p.locationName === x.codeName)
                    ?.activities || [];

                return (
                  <div
                    key={x.codeName}
                    className="flex flex-col gap-2 shadow-md p-4 border border-slate-300 rounded-md"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>{x.name}</span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="flex items-center cursor-pointer"
                          onClick={() => handleDeleteLocation(x)}
                        >
                          <Trash2 className="w-4 md:w-5 h-4 md:h-5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Thêm hoạt động, điểm tham quan"
                        value={inputs[x.codeName] || ""}
                        onChange={(e) => onChange(e, x.codeName)}
                        className="px-3 border border-slate-300 rounded-md w-full h-8 md:h-10 text-xs md:text-sm"
                      />
                      <button type="button" onClick={() => onAdd(x.codeName)}>
                        <CirclePlus className="w-4 md:w-5 h-4 md:h-5" />
                      </button>
                    </div>

                    {!!actions.length && (
                      <ul className="flex flex-col gap-1">
                        {actions.map((action, index) => (
                          <li
                            key={action}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>
                              {index + 1}. {action}
                            </span>
                            <button
                              type="button"
                              onClick={() => onDelete(x.codeName, action)}
                              className="cursor-pointer"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
          {!Utils.object.isEmpty(plan.locations) && (
            <div className="flex justify-end mb-4">
              <Tooltip title="Tạo lịch trình">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
                >
                  Lưu
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
