import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  AutocompleteRenderInputParams,
} from "@mui/material";
import debounce from "lodash/debounce";
import { LookupItem } from "../libs/types/common";
import { Map } from "lucide-react";
import TBInput from "../ui/TBInput";

type TbLocationSearchProps = {
  variant?: "outlined" | "filled" | "standard";
  onChange?: (value: LookupItem | null) => void;
};

export default function TbLocationSearch({
  variant = "outlined",
  onChange,
}: TbLocationSearchProps) {
  const [options, setOptions] = useState<LookupItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<LookupItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          searchTerm.trim(),
        )}&apiKey=ed624b0b709f4d47a6648b2c9dd7cb63`,
      );

      const data = await response.json();

      const mappedOptions: LookupItem[] =
        data?.features?.map((x: any) => ({
          label: x.properties.formatted,
          value: x.properties.formatted, // bạn có thể thay bằng place_id nếu muốn unique hơn
        })) || [];

      setOptions(mappedOptions);
    } catch (error) {
      console.error("Lỗi Geoapify:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchOptions, 500), []);

  useEffect(() => {
    debouncedFetch(inputValue);
    return () => debouncedFetch.cancel();
  }, [inputValue, debouncedFetch]);

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: LookupItem | string | null,
  ) => {
    let selected: LookupItem | null = null;

    if (newValue && typeof newValue === "object") {
      selected = newValue;
    } else if (typeof newValue === "string" && newValue.trim()) {
      // Tùy chọn: cho phép tạo tạm nếu muốn hỗ trợ free solo
      selected = { label: newValue.trim(), value: newValue.trim() };
    }

    setValue(selected);
    setInputValue("");
    onChange?.(selected);
  };

  return (
    <Autocomplete
      size="small"
      freeSolo // ← Quan trọng: nên bật khi dùng search động
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option?.label ?? "";
      }}
      isOptionEqualToValue={(option, val) =>
        option.value === (typeof val === "string" ? val : val?.value)
      }
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TBInput
          {...params}
          label=""
          variant={variant}
          placeholder="Gắn địa điểm (nếu có)"
          slotProps={{
            ...params.InputProps,
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Map size={14} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      noOptionsText="Không tìm thấy địa chỉ phù hợp"
      loadingText="Đang tìm kiếm..."
      clearOnBlur
      selectOnFocus
      openOnFocus={false} // tránh mở popup rỗng khi focus
      filterOptions={(x) => x}
    />
  );
}
