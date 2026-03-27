"use client";
import TBVietnamMap from "./TBVietnamMap";
import { LocationInfo } from "../model";
import { Box } from "@mui/material";

type TBMapViewerProps = {
  locations: LocationInfo[];
  onChoose?: (location: LocationInfo) => void;
};

export default function TBMapViewer({
  locations = [],
  onChoose,
}: TBMapViewerProps) {
  const handleChooseProvince = (location: LocationInfo) => {
    if (onChoose) {
      onChoose(location);
    }
  };
  return (
    <Box sx={{ position: "relative", p: 1.5, width: "100%", height: "auto" }}>
      <TBVietnamMap
        locations={locations}
        onClick={(location) => handleChooseProvince(location)}
      />
    </Box>
  );
}
