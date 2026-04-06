import { DATE_FORMAT } from "@/libs/constants";
import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export type TbDateRangePickerEvent = {
  to: Dayjs | undefined;
  from: Dayjs | undefined;
};
type TbDateRangePickerProps = {
  from: Dayjs | undefined;
  fromTitle?: string;
  to: Dayjs | undefined;
  toTitle?: string;
  format?: string;
  onDateChange?: ({ from, to }: TbDateRangePickerEvent) => void;
};
export default function TbDateRangePicker({
  from,
  to,
  fromTitle = "From",
  toTitle = "To",
  format = "YYYY-MM-DD",
  onDateChange,
}: TbDateRangePickerProps) {
  return (
    <Stack flexDirection="row" alignItems="center" gap={2}>
      <DatePicker
        label={fromTitle}
        defaultValue={from ? dayjs(from) : undefined}
        slotProps={{ textField: { size: "small", required: true } }}
        onChange={(value: Dayjs | null) => {
          onDateChange?.({ from: value || undefined, to });
        }}
        format={format}
      />
      đến
      <DatePicker
        label={toTitle}
        defaultValue={to ? dayjs(to) : undefined}
        slotProps={{ textField: { size: "small", required: true } }}
        onChange={(value: Dayjs | null) => {
          onDateChange?.({ from, to: value || undefined });
        }}
        format={format}
      />
    </Stack>
  );
}
