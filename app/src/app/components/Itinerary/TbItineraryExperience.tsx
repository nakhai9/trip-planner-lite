"use client";
import TBInput from "@/app/ui/TBInput";
import { Box, Stack } from "@mui/material";
import TbLocationSearch from "../TbLocationSearch";
import TBIconButton from "@/app/ui/TBIconButton";
import { PlusCircle, XCircle } from "lucide-react";
import { Utils } from "@/app/libs/utils";
import { useState } from "react";
import { LookupItem } from "@/app/libs/types/common";
import { useToast } from "@/app/store/global-store";

export type Experience = {
  name: string;
  // type: "activity" | "food" | "place";
  address?: string;
  objectId?: string;
};

type TbItineraryExperienceProps = {
  data?: Experience;
  onChange?: (data: Experience) => void;
};

export default function TbItineraryExperience({
  data,
  onChange,
}: TbItineraryExperienceProps) {
  const [value, setValue] = useState<string>("");
  const [location, setLocation] = useState<LookupItem | null>(null);
  const { showError } = useToast();

  const handleChange = () => {
    if (!value) {
      showError("Trường hoạt động, điểm tham quan không được trống");
      return;
    }
    onChange?.({
      name: value,
      address: location ? location.label : "",
      objectId: data ? data.objectId : Utils.random.uuid(),
    });
    onReset();
  };

  const handleLocationChange = (selected: LookupItem | null) => {
    if (!selected) return;
    setLocation(selected);
  };

  const handleInputChange = (e: any) => {
    setValue((e.target as HTMLInputElement)?.value);
  };

  const onReset = () => {
    setValue("");
    setLocation(null);
  };

  return (
    <Stack direction="column" spacing={3}>
      <TBInput
        type="text"
        placeholder="Thêm hoạt động, điểm tham quan"
        onChange={handleInputChange}
        value={value}
        variant="standard"
      />
      <TbLocationSearch
        variant="standard"
        onChange={(selected) => handleLocationChange(selected)}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TBIconButton type="button" onClick={handleChange}>
          <PlusCircle size={20} />
        </TBIconButton>
        <TBIconButton type="button">
          <XCircle size={20} />
        </TBIconButton>
      </Box>
    </Stack>
  );
}
