"use client";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import VietnamMap from "./VietnamMap";
import { LocationInfo } from "../model";
import { ArrowRightLeft } from "lucide-react";
import { CircularProgress } from "@mui/material";

type MapViewerProps = {
  locations: LocationInfo[];
  onChoose?: (location: LocationInfo) => void;
};

export default function MapViewer({
  locations = [],
  onChoose,
}: MapViewerProps) {
  const handleChooseProvince = (location: LocationInfo) => {
    if (onChoose) {
      onChoose(location);
    }
  };
  return (
    <div className="relative p-3 w-full h-auto">
      {/* { loading &&
        <CircularProgress
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            color: "#FE9A00",
          }}
        />
      } */}
      {/* <TransformWrapper
        minScale={1}
        maxScale={6}
        limitToBounds
        panning={{ velocityDisabled: true }}
      >
        {({ zoomToElement }) => (
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <VietnamMap
              locationIds={locationIds}
              onClick={(location) => handleChooseProvince(location)}
              zoomToElement={zoomToElement}
            />
          </TransformComponent>
        )}
      </TransformWrapper> */}
      <VietnamMap
        locations={locations}
        onClick={(location) => handleChooseProvince(location)}
      />
    </div>
  );
}
