"use client";

import React from "react";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";

export type TBButtonProps = Omit<ButtonProps, "variant"> & {
  variant?: "primary" | "outline" | "ghost";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function TBButton({
  children,
  variant = "primary",
  leftIcon,
  rightIcon,
  type = "button",
  sx,
  ...rest
}: TBButtonProps) {
  const muiVariant =
    variant === "primary"
      ? "contained"
      : variant === "outline"
        ? "outlined"
        : "text";

  const iconOnly = !children && Boolean(leftIcon || rightIcon);

  return (
    <Button
      type={type}
      variant={muiVariant}
      color={variant === "ghost" ? "inherit" : "primary"}
      startIcon={leftIcon as React.ReactNode}
      endIcon={rightIcon as React.ReactNode}
      sx={{
        ...(iconOnly ? { minWidth: 40 } : {}),

        ...(variant === "ghost" && {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          color: "inherit",

          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            boxShadow: "none",
          },
        }),

        fontWeight: 500,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
