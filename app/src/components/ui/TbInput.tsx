"use client";

import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export type TbInputProps = TextFieldProps & {
  containerClassName?: string;
  onIconClick?: () => void;
};

export default function TbInput({
  label,
  required,
  containerClassName,
  sx,
  ...rest
}: TbInputProps) {
  return (
    <TextField
      fullWidth
      label={label}
      required={required}
      className={containerClassName}
      sx={{
        // "& .MuiOutlinedInput-notchedOutline": {
        //   borderWidth: 2,
        //   borderColor: "primary.main",
        // },
        // "&:hover .MuiOutlinedInput-notchedOutline": {
        //   borderColor: "primary.main",
        // },
        // "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        //   borderColor: "primary.main",
        // },
        ...sx,
      }}
      {...rest}
    />
  );
}
