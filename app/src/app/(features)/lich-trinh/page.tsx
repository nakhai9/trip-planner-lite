"use client";

import React from "react";
import { Tooltip } from "@mui/material";
import { Bot, MapPin, X } from "lucide-react";

import { useVietnamMapStore } from "@/app/store/vietnam-map-store";
import MainLayout from "@/app/ui/layout/MainLayout";

type Plan = {
  title?: string;
  startAt?: string;
  description?: string;
  map: {
    codeName: string;
    actionsAtLocation: string[];
  }[];
};

export default function TravelPlan() {
  const { selectedLocations } = useVietnamMapStore();

  const [plan, setPlan] = React.useState<Plan>({
    title: "demo",
    map: [],
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

    setPlan((prev) => {
      const existed = prev.map.find((m) => m.codeName === codeName);

      if (existed) {
        return {
          ...prev,
          map: prev.map.map((m) =>
            m.codeName === codeName
              ? {
                  ...m,
                  actionsAtLocation: [...m.actionsAtLocation, action],
                }
              : m,
          ),
        };
      }

      return {
        ...prev,
        map: [
          ...prev.map,
          {
            codeName,
            actionsAtLocation: [action],
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
      map: prev.map.map((m) =>
        m.codeName === codeName
          ? {
              ...m,
              actionsAtLocation: m.actionsAtLocation.filter(
                (a) => a !== action,
              ),
            }
          : m,
      ),
    }));
  };

  return (
    <MainLayout hideButton>
      <div className="mt-5 md:p-0 px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium text-gray-700 text-xl">
            Lịch trình sắp đến
          </div>

          <div className="flex items-center gap-2">
            <Tooltip title="Tạo lịch trình">
              <button
                type="button"
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-4 rounded-md h-8 md:h-10 text-white text-xs md:text-sm cursor-pointer"
              >
                Lưu
              </button>
            </Tooltip>
            <Tooltip title="Hỏi AI">
              <button
                type="button"
                className="flex items-center gap-2 px-4 border border-amber-600 rounded-md h-8 md:h-10 text-amber-600 text-xs md:text-sm cursor-pointer"
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
                  plan.map.find((p) => p.codeName === x.codeName)
                    ?.actionsAtLocation || [];

                return (
                  <div
                    key={x.codeName}
                    className="flex flex-col gap-4 shadow-md p-4 border border-slate-300 rounded-md"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4" />
                      <span>{x.name}</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Thêm hoạt động, điểm tham quan"
                        value={inputs[x.codeName] || ""}
                        onChange={(e) => onChange(e, x.codeName)}
                        className="px-3 border border-slate-300 rounded-md w-full h-8 md:h-10 text-xs md:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => onAdd(x.codeName)}
                        className="bg-slate-700 px-3 rounded-md text-white text-xs md:text-sm"
                      >
                        Thêm
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
        </div>

        {/* debug */}
        {/* <pre>{JSON.stringify(plan, null, 2)}</pre> */}
        {<pre>{JSON.stringify(selectedLocations, null, 2)}</pre>}
      </div>
    </MainLayout>
  );
}
