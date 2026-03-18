"use client";

import clsx from "clsx";
import {
  CirclePlus,
  Clock3,
  Map,
  MapPinPlus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { useGlobalStore, useToast } from "../store/global-store";
import Input from "../ui/input";
import IconButton from "../ui/icon-button";
import { Chip } from "@mui/material";
import { Utils } from "../libs/utils";
import { Province } from "../model";
import { HttpClient } from "../libs/api/axios";
import { API_URLS } from "../libs/api/api.constant";
import { useVietnamMapStore } from "../store/vietnam-map-store";

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
type DestinationCardProps = {
  destination: Destination;
  onSelectChange?: (destination: Destination) => void;
  onActivityChange?: (destination: Destination) => void;
  onDelete?: (destination: Destination) => void;
  onEdit?: (destination: Destination) => void;
  onChange?: (destination: Destination) => void;
  readonly?: boolean;
  version?: "v1" | "v2";
};
export default function DestinationCard({
  destination,
  readonly = false,
  version = "v1",
  onSelectChange,
  onActivityChange,
  onDelete,
  onEdit,
  onChange,
}: DestinationCardProps) {
  const [activity, setActivity] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<
    Province | undefined
  >(undefined);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const { setIsLoading } = useGlobalStore();
  const { showError } = useToast();
  const { isNewMap } = useVietnamMapStore();
  const [modalConfig, setModalConfig] = useState({
    key: "",
  });

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

    onChange?.({
      ...destination,
      activities: [
        ...(destination.activities || []),
        {
          name: activity,
        },
      ],
    });
  };

  const handleInputChange = (e: any) => {
    const value = (e.target as HTMLInputElement)?.value ?? "";
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

  const openMap = (address: string) => {
    toggleModal();
    setModalConfig({
      key: "map",
    });
    const googleMapSearchUrl =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH_URL || "";
    if (!googleMapSearchUrl) return;
    if (!address) {
      showError("Địa chỉ không tồn tại hoặc đang trống");
      return;
    }
    const url = `${googleMapSearchUrl}${encodeURIComponent(address)}&output=embed`;
    setIframeSrc(url);
    toggleModal();
    // window.open(url, "_blank");
  };

  const toggleModal = () => {
    setOpen(!open);
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
  }, [isNewMap]);

  const handleClickOnAddress = async () => {
    toggleModal();
    setModalConfig({
      key: "list",
    });
    fetchProvinces();
  };

  const handleChooseProvince = (province: Province) => {
    toggleModal();
    setSelectedProvince(province);
    onChange?.({
      ...destination,
      name: province.name,
      codeName: province.codeName,
    });
  };

  return (
    <React.Fragment>
      {/* {version && Utils.compare.isEqual(version, "v1") && (
        <>
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
                          <div className="flex justify-start items-center gap-2">
                            {a.address && (
                              <p
                                className="flex items-center gap-1 text-blue-500 text-xs cursor-pointer"
                                onClick={() =>
                                  openMap(
                                    a.address ? `${a.name} ${a.address}` : "",
                                  )
                                }
                              >
                                <Map size={14} />
                                Bản đồ
                              </p>
                            )}
                            {!a.address && (
                              <p
                                className="flex items-center gap-1 text-blue-500 text-xs cursor-pointer"
                                onClick={toggleModal}
                              >
                                <MapPinPlus size={14} />
                                Thêm địa chỉ
                              </p>
                            )}
                          </div>
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
        </>
      )} */}
      {version && Utils.compare.isEqual(version, "v2") && (
        <>
          <div className="bg-slate-100 shadow-md border border-slate-100 rounded-lg w-full overflow-hidden">
            <div className="p-2 border-slate-300 border-b">
              <div className="flex justify-between items-center">
                {
                  <p
                    className={clsx(
                      "flex items-center gap-2",
                      readonly && "pointer-events-none",
                    )}
                    onClick={handleClickOnAddress}
                  >
                    <MapPinPlus size={16} />
                    <span>
                      {selectedProvince?.name || destination.name || "Địa chỉ"}
                    </span>
                  </p>
                }

                {/* <div className="text-sm">Ngày {destination.day}</div> */}
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
            </div>

            <div className="flex flex-col gap-2 p-2 max-h-90 overflow-auto">
              {!destination.activities?.length && (
                <p className="block text-sm text-center">Không có dữ liệu</p>
              )}
              {destination.activities.map((act) => (
                <div
                  className="bg-white px-2 py-1 rounded-md"
                  key={act.name + "/address=" + act.address}
                >
                  <div className="flex justify-start gap-2">
                    <p className="flex items-center gap-1 font-thin text-xs cursor-pointer">
                      <Clock3 size={14} />
                      <span>Thời gian</span>
                    </p>
                    <p
                      onClick={() =>
                        openMap(act.address ? `${act.name} ${act.address}` : "")
                      }
                      className={clsx(
                        "flex items-center gap-1 text-blue-600 text-xs",
                        act.address
                          ? "cursor-pointer"
                          : "cursor-not-allowed pointer-events-none ",
                      )}
                    >
                      <Map size={14} />
                      <span>Bản đồ</span>
                    </p>
                  </div>
                  <p className="block mt-2 text-sm">{act.name}</p>
                </div>
              ))}
            </div>
          </div>

          {open && (
            <div className="z-[999] fixed inset-0 flex justify-center items-center bg-black/50 w-full h-screen transition-opacity duration-300">
              <div className="relative bg-white shadow-sm px-4 py-2 rounded-sm w-sm md:w-4xl lg:w-5xl max-h-[80vh]">
                <div className="flex justify-between items-center pb-2 font-medium text-slate-800 text-xl shrink-0">
                  <div className="">
                    {modalConfig.key === "list"
                      ? "Chọn tỉnh/thành phố tại Việt Nam"
                      : "Xem bản đồ"}
                  </div>
                  <IconButton className="text-gray-700" onClick={toggleModal}>
                    <X />
                  </IconButton>
                </div>

                {modalConfig.key === "list" && (
                  <div className="relative py-4 border-slate-200 border-t h-full font-light text-slate-600 leading-normal">
                    {provinces.map((p) => (
                      <Chip
                        key={p.id}
                        label={p.name || ""}
                        className={clsx(
                          "!mr-2 !mb-2 !text-xs !md:text-sm",
                          selectedProvince?.codeName === p.codeName
                            ? "!text-white !bg-[#836FFF] "
                            : "",
                        )}
                        onClick={() => handleChooseProvince(p)}
                      />
                    ))}
                  </div>
                )}

                {modalConfig.key === "map" && (
                  <div className="relative py-4 border-slate-200 border-t h-full font-light text-slate-600 leading-normal">
                    <iframe
                      src={iframeSrc}
                      className="w-full h-80"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
}
