"use client";

import { Utils } from "@/libs/utils";
import { useToast } from "@/store/global-store";
import { ItineraryActivity, LookupItem } from "@/types/common";
import { Box, Stack } from "@mui/material";
import { useState } from "react";
import TbInput from "../ui/TbInput";
import TbLocationSearch from "../TbLocationSearch";
import TbIconButton from "../ui/TbIconButton";
import { PlusCircle, XCircle } from "lucide-react";

type TbItineraryActivityFormProps = {
  activity?: ItineraryActivity;
  onChange?: (data: ItineraryActivity) => void;
  onClickXButton?: () => void;
};

export default function TbItineraryActivityForm({
  activity,
  onChange,
  onClickXButton,
}: TbItineraryActivityFormProps) {
  const [value, setValue] = useState<string>("");
  const [location, setLocation] = useState<LookupItem | null>(null);
  const [locationInput, setLocationInput] = useState<string>("");
  const { showError } = useToast();

  const handleChange = () => {
    if (!value) {
      showError("Trường hoạt động, điểm tham quan không được trống");
      return;
    }
    onChange?.({
      description: value,
      location: {
        coordinates: location ? JSON.parse(location.value) : [],
      },
      objectId: activity ? activity.objectId : Utils.random.uuid(),
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

  const handleInputLocationChange = (text: string) => {
    setLocationInput(text);
  };

  return (
    <Stack direction="column" spacing={3}>
      <>
        <TbInput
          type="text"
          placeholder="Thêm hoạt động, điểm tham quan"
          onChange={handleInputChange}
          value={value}
          variant="standard"
          autoFocus={true}
        />
        <TbLocationSearch
          variant="standard"
          onChange={(selected) => handleLocationChange(selected)}
          onInputChange={(text) => handleInputLocationChange(text)}
        />
      </>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TbIconButton type="button" onClick={handleChange}>
          <PlusCircle size={20} />
        </TbIconButton>
        <TbIconButton type="button" onClick={onClickXButton}>
          <XCircle size={20} />
        </TbIconButton>
      </Box>
    </Stack>
  );
}
