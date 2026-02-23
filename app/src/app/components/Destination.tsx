"use client";

import clsx from "clsx";
import { CirclePlus, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";

export type Destination = {
  id?: string;
  codeName: string;
  name: string;
  activities: string[];
  day: number;
};
type DestinationItemProps = {
  destination: Destination;
  onSelectChange?: (destination: Destination) => void;
  onActivityChange?: (destination: Destination) => void;
  onDelete?: (destination: Destination) => void;
  readonly?: boolean;
};
export default function DestinationItem({
  destination,
  readonly = false,
  onSelectChange,
  onActivityChange,
  onDelete,
}: DestinationItemProps) {
  const [activity, setActivity] = useState<string>("");

  const handleSelectChange = (e: any) => {
    onSelectChange?.({
      ...destination,
      day: Number((e.target as HTMLSelectElement)?.value),
    });
  };

  const handleAddActivity = () => {
    setActivity("");
    onActivityChange?.({
      ...destination,
      activities: [...destination.activities, activity],
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

  return (
    <div className="shadow-lg p-4 border border-slate-300 rounded-md w-full text-gray-700">
      <div
        className={clsx(
          "flex items-center gap-1 mb-2",
          readonly ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex justify-center items-center">
          <select
            onChange={(e) => handleSelectChange(e)}
            defaultValue={destination.day}
            disabled={readonly}
            className={clsx(readonly && "hidden")}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((opt) => (
              <option key={opt} value={opt}>
                Ngày {opt}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 font-medium text-xl">
            <MapPin className="w-4 h-4" />
            <p>
              {destination.name}
              {readonly && (
                <span className="text-sm"> (Ngày {destination.day})</span>
              )}
            </p>
          </div>
        </div>
        <div className="w-4 md:w-5 h-4 md:h-5">
          <button
            className={clsx("cursor-pointer", readonly && "hidden")}
            type="button"
            onClick={handleDelete}
          >
            <Trash2 className="text-red-500" />
          </button>
        </div>
      </div>
      {!readonly && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Thêm hoạt động, điểm tham quan"
            className="px-3 border border-slate-300 rounded-md w-full h-8 md:h-10 text-xs md:text-sm"
            value={activity}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={handleAddActivity}
            className="cursor-pointer"
          >
            <CirclePlus className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
      )}
      {destination.activities.length > 0 ? (
        <ul className="mt-2 list-disc">
          {destination.activities?.map((a) => {
            return (
              <li key={a} className="ml-4 text-xs md:text-sm">
                {a}
              </li>
            );
          })}
        </ul>
      ) : (
        <span className="mt-1 text-gray-500 text-xs md:text-sm italic">
          Chưa có hoạt động, địa điểm nào được thêm
        </span>
      )}
    </div>
  );
}
