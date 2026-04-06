"use client";

import { useRef, useState } from "react";
import { useVietnamMapStore } from "../store/vietnam-map-store";
import useMousePosition from "../hooks/useMousePosition";
import { Box } from "@mui/material";
import { hexWithAlpha, TB_COLORS } from "@/libs/colors";
import { LocationInfo, LocationModel } from "@/types/common";

type TbVietnamMapProps = {
  locationIds?: string[];
  locations?: LocationInfo[];
  onClick?: (location: LocationInfo) => void;
  zoomToElement?: (
    node: string | HTMLElement,
    scale?: number,
    animationTime?: number,
    animationType?:
      | "easeOut"
      | "linear"
      | "easeInQuad"
      | "easeOutQuad"
      | "easeInOutQuad"
      | "easeInCubic"
      | "easeOutCubic"
      | "easeInOutCubic"
      | "easeInQuart"
      | "easeOutQuart"
      | "easeInOutQuart"
      | "easeInQuint"
      | "easeOutQuint"
      | "easeInOutQuint",
  ) => void;
};

export default function TbVietnamMap({
  locationIds = [],
  locations = [],
  onClick,
  zoomToElement,
}: TbVietnamMapProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentMap = useVietnamMapStore((state) => state.currentMap);
  const { x, y } = useMousePosition();
  const [text, setText] = useState<string | null>(null);

  const handleClick = (item: LocationModel) => {
    if (item.codeName)
      onClick?.({
        codeName: item.codeName,
        name: item.name,
        status: locations.find((loc) => loc.codeName === item.codeName)?.status,
      });
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        id="vietnam-map-wrapper"
        ref={wrapperRef}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box
          component="svg"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
          id="vietnam-map-svg"
          sx={{
            width: { xs: 400, sm: 400, md: 600 },
            height: { xs: 400, sm: 400, md: 600 },
            maxWidth: 500,
            userSelect: "none",
          }}
        >
          <g className="group-state">
            {currentMap.map((item: LocationModel) => (
              <g
                key={item.codeName}
                dangerouslySetInnerHTML={{ __html: item.svgData }}
                fill={
                  locations.some(
                    (location) =>
                      location.codeName === item.codeName &&
                      location.status === "VISITED",
                  )
                    ? "#BB4D00"
                    : locations.some(
                          (location) =>
                            location.codeName === item.codeName &&
                            location.status === "UPCOMING",
                        )
                      ? "#836FFF"
                      : "#FE9A00"
                }
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(item)}
                onMouseEnter={() => setText(item.name)}
                onMouseLeave={() => setText(null)}
              />
            ))}
          </g>
        </Box>
      </Box>
      <Box
        id="state-tooltip"
        sx={{
          display: { xs: "none", md: text ? "block" : "none" },
          position: "fixed",
          zIndex: (t) => t.zIndex.tooltip,
          left: x + 12,
          top: y + 12,
          pointerEvents: "none",
          bgcolor: hexWithAlpha(TB_COLORS.black, 0.8),
          px: 1.25,
          py: 0.75,
          borderRadius: 0.5,
          color: "common.white",
          fontSize: "0.875rem",
          lineHeight: "14px",
        }}
      >
        {text}
      </Box>
    </Box>
  );
}
