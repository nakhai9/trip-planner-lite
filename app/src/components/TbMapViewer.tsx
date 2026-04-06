"use client";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import TbVietnamMap from "./TbVietnamMap";
import { LocationInfo } from "@/types/common";
type TbMapViewerProps = {
  locations: LocationInfo[];
  onChoose?: (location: LocationInfo) => void;
};

export default function TbMapViewer({
  locations = [],
  onChoose,
}: TbMapViewerProps) {
  const handleChooseProvince = (location: LocationInfo) => {
    if (onChoose) {
      onChoose(location);
    }
  };
  return (
    <Box sx={{ position: "relative", p: 1.5, width: "100%", height: "auto" }}>
      <TbVietnamMap
        locations={locations}
        onClick={(location) => handleChooseProvince(location)}
      />
    </Box>
  );
}
