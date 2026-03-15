"use client";

import clsx from "clsx";
import {
  CirclePlus,
  LandPlot,
  MapPin,
  MapPinned,
  Navigation,
  Pencil,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "../store/global-store";
import Input from "../ui/input";
import IconButton from "../ui/icon-button";

export type Destination = {
  id?: string;
  codeName: string;
  name: string;
  activities: Array<{
    name: string;
    address?: string;
  }>;
  day: number;
};
type DestinationItemProps = {
  destination: Destination;
  onSelectChange?: (destination: Destination) => void;
  onActivityChange?: (destination: Destination) => void;
  onDelete?: (destination: Destination) => void;
  onEdit?: (destination: Destination) => void;
  readonly?: boolean;
};
export default function DestinationItem({
  destination,
  readonly = false,
  onSelectChange,
  onActivityChange,
  onDelete,
  onEdit,
}: DestinationItemProps) {
  const [activity, setActivity] = useState<string>("");

  const { showError } = useToast();

  const handleSelectChange = (e: any) => {
    onSelectChange?.({
      ...destination,
      day: Number((e.target as HTMLSelectElement)?.value),
    });
  };

  const handleAddActivity = () => {
    if (!activity) {
      showError("Trường không được để trống");
      return;
    }
    setActivity("");
    onActivityChange?.({
      ...destination,
      activities: [
        ...destination.activities,
        {
          name: activity,
        },
      ],
    });
  };

  const handleInputChange = (e: any) => {
    const value = (e.target as HTMLInputElement)?.value ?? "";
    if (!value) return;
    setActivity(value);
  };

  const handleDelete = () => {
    onDelete?.(destination);
  };

  const handleEdit = () => {
    onEdit?.(destination);
  };

  const handleDeleteActivities = (activity: string) => {
    onActivityChange?.({
      ...destination,
      activities: [
        ...destination.activities.filter((a) => a.name !== activity),
      ],
    });
  };

  const getCoordinates = async (address: string) => {
    if (!address) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent("Đền thờ Vua Hùng Cần Thơ")}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "my-travel-app",
        "Accept-Language": "*",
      },
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <div className="shadow-lg border border-slate-300 rounded-md w-full overflow-hidden text-gray-700">
      <div
        className={clsx(
          "flex items-center gap-1 bg-amber-600 mb-2 p-3",
          readonly ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex justify-center items-center">
          <MapPin className="mr-2 w-4 md:w-5 h-4 md:h-5 text-white" />
          <div className="flex items-center gap-1 font-medium text-white text-sm md:text-xl">
            <p>
              {destination.name}
              {readonly && (
                <span className="text-sm"> (Ngày {destination.day})</span>
              )}
            </p>
          </div>
          <select
            onChange={(e) => handleSelectChange(e)}
            defaultValue={destination.day}
            disabled={readonly}
            className={clsx(readonly && "hidden", "ml-2")}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((opt) => (
              <option key={opt} value={opt}>
                Ngày {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1 item-centers">
          <IconButton
            className={clsx("bg-red-50", readonly && "hidden")}
            type="button"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 md:w-5 h-4 md:h-5 text-red-600" />
          </IconButton>
          <IconButton
            className={clsx(
              "hidden bg-slate-50 text-amber-600",
              readonly && "hidden",
            )}
            type="button"
            onClick={handleEdit}
          >
            <Pencil className="w-4 md:w-5 h-4 md:h-5" />
          </IconButton>
        </div>
      </div>
      <div className="p-3">
        {!readonly && (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Thêm hoạt động, điểm tham quan"
              className="h-8 md:h-10 text-xs md:text-sm"
              value={activity}
              onChange={handleInputChange}
            />
            <IconButton type="button" onClick={handleAddActivity}>
              <CirclePlus className="flex-1 w-4 md:w-5 h-4 md:h-5 shrink-0" />
            </IconButton>
          </div>
        )}
        <div className="mt-2 max-h-[300px] overflow-y-auto">
          {destination.activities.length > 0 ? (
            <div>
              {/* <p className="block my-2 font-medium text-amber-600 text-sm text-center">
                Hoạt động, điểm than quan
              </p> */}
              {destination.activities?.map((a, index) => {
                return (
                  <div
                    key={a.name + "/" + a.address}
                    className="flex flex-col gap-1 py-1 w-full"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm">{a.name}</div>
                      <IconButton
                        type="button"
                        onClick={() => handleDeleteActivities(a.name)}
                        className={clsx(
                          "flex items-center",
                          readonly && "hidden",
                        )}
                      >
                        <X className="w-4 h-4 font-bold text-red-500" />
                      </IconButton>
                    </div>
                    <div
                      className="flex items-center gap-1 font-normal text-xs"
                      onClick={() => getCoordinates(a.address ?? "")}
                    >
                      <Navigation size={14} className="shrink-0" />
                      <span className="truncate">{a.address}</span>
                    </div>

                    {/* <IconButton
                      type="button"
                      onClick={() => handleDeleteActivities(a.name)}
                      className={clsx(
                        "flex items-center",
                        readonly && "hidden",
                      )}
                    >
                      <MapPinned className="w-4 h-4 font-bold text-red-500" />
                    </IconButton> */}
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="mt-1 text-gray-500 text-xs md:text-sm italic">
              Chưa có hoạt động, địa điểm nào được thêm
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
