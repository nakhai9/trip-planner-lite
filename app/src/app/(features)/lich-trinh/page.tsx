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
import DestinationCard, { Destination } from "@/app/components/Destination";
import { ResponseId } from "@/app/libs/api/api.models";
import Button from "@/app/ui/button";
import Input from "@/app/ui/input";

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

export default function TripBuilder() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const {
    selectedLocations,
    selectedLocationsToShare,
    isNewMap,
    updateSelectedLocations,
    switchToMap,
    resetSelectedLocations,
    resetSelectedLocationsToShare,
  } = useVietnamMapStore();
  const { setIsLoading } = useGlobalStore();
  const { showError } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [plan, setPlan] = useState<Plan | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>("");

  const navigateToPage = (url?: string) => {
    if (!url) return;
    router.push(url);
  };

  const askGeminiToCreatePlan = async () => {
    setIsLoading(true, "Google Gemini đang tìm kiếm những gợi ý phù hợp...");
    try {
      if (!destinations?.length) return;
      const data = await GeminiService.askGeminiToCreatePlan(
        destinations.filter((x) => !x.codeName),
      );
      if (data) {
        const result = JSON.parse(data);
        setDestinations(result);
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
        accessCode: accessCode || undefined,
        isPublic: !accessCode.length && !isPrivate,
      });
      if (!data) return;
      navigateToPage(`/lich-trinh/${data.id}`);
    } catch (error) {
      showError("Lỗi không thể lưu");
    } finally {
      setIsLoading(false);
      initPlan();
      resetSelectedLocations();
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

  // const fetchProvinces = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const provinces = await HttpClient.get<Province[]>(
  //       `${API_URLS.provinces}${isNewMap ? "?type=new" : "?type=old"}`,
  //     );
  //     setProvinces(provinces);
  //   } catch (error) {
  //     showError("Lỗi: Không thể tải dữ liệu");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [currentStep, isNewMap]);

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

  const handleSetPrivate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setAccessCode("");
    }
    setIsPrivate(event.target.checked);
  };

  const create = () => {
    setDestinations((prev) => [
      ...prev,
      {
        codeName: "",
        name: "",
        activities: [],
        day: 1,
      } as unknown as Destination,
    ]);
  };

  const update = (index: number, des: Destination) => {
    setDestinations((prev) =>
      prev.map((item, i) => (i === index ? des : item)),
    );
  };

  const handleDeleteCard = (destination: Destination) => {
    setDestinations((prev) =>
      prev.filter((_des) => destination.codeName !== _des.codeName),
    );
  };

  return (
    <MainLayout hideButton>
      <div className="mt-20 md:p-0 px-4">
        <div className="flex justify-end items-center gap-3">
          <button onClick={create} className="cursor-pointer">
            Thêm mới
          </button>
          <button>Lưu</button>
          <button
            onClick={askGeminiToCreatePlan}
            className="text-red-500 cursor-pointer"
          >
            Gợi ý địa điểm
          </button>
        </div>
        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((des, index) => (
            <DestinationCard
              key={index}
              destination={des}
              readonly={false}
              version="v2"
              onChange={(destination) => update(index, destination)}
              onDelete={(destination) => handleDeleteCard(destination)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
