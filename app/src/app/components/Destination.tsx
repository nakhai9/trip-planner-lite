"use client";

import clsx from "clsx";
import { CirclePlus, MapPin, Pencil, Trash, Trash2, X } from "lucide-react";
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

  const handleEdit = () => {
    onEdit?.(destination);
  };

  const handleDeleteActivities = (activity: string) => {
    onActivityChange?.({
      ...destination,
      activities: [...destination.activities.filter((a) => a !== activity)],
    });
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
          <MapPin className="w-4 md:w-5 h-4 md:h-5 text-white" />
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

          <div className="flex items-center gap-1 font-medium text-white text-xl">
            <p>
              {destination.name}
              {readonly && (
                <span className="text-sm"> (Ngày {destination.day})</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-1 item-centers">
          <button
            className={clsx(
              "bg-red-50 p-1 rounded-full cursor-pointer",
              readonly && "hidden",
            )}
            type="button"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 md:w-5 h-4 md:h-5 text-red-600" />
          </button>
          <button
            className={clsx(
              "hidden bg-slate-50 p-1 rounded-full text-amber-600 cursor-pointer",
              readonly && "hidden",
            )}
            type="button"
            onClick={handleEdit}
          >
            <Pencil className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
      </div>
      <div className="p-3">
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
        <div className="mt-2 max-h-[300px] overflow-y-auto">
          {destination.activities.length > 0 ? (
            <div>
              <p className="block my-2 font-medium text-amber-600 text-sm text-center">
                Hoạt động, điểm than quan
              </p>
              <ul className="marker:text-amber-600 list-disc">
                {destination.activities?.map((a) => {
                  return (
                    <li key={a} className="ml-5 text-xs md:text-sm">
                      <div className="flex items-center gap-1 w-full">
                        <p>{a}</p>
                        <button
                          type="button"
                          onClick={() => handleDeleteActivities(a)}
                          className={clsx(
                            "flex items-center",
                            readonly && "hidden",
                          )}
                        >
                          <X className="w-3 h-3 font-bold text-red-500" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
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
