"use client";

import React from "react";
import IconButton from "@mui/material/IconButton";
import type { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";
import { hexWithAlpha, TB_COLORS } from "@/libs/colors";

export type TbIconButtonProps = MuiIconButtonProps & {
  active?: boolean;
};

export default function TbIconButton({
  active,
  sx,
  ...rest
}: TbIconButtonProps) {
  return (
    <IconButton
      sx={{
        ...(active
          ? {
              bgcolor: hexWithAlpha(TB_COLORS.primary, 0.08),
              color: "primary.main",
            }
          : {}),
        ...sx,
      }}
      {...rest}
    />
  );
}
