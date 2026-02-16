import { useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { FilterBarProps, TextFilterConfig } from "./types";

/** Text filter with local state + debounce so keystrokes aren't lost. */
function DebouncedTextField({
  filter,
  value,
  onChange,
}: {
  filter: TextFilterConfig;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const handleChange = useCallback(
    (next: string) => onChange(filter.key, next),
    [onChange, filter.key],
  );

  const [localValue, setLocalValue] = useDebouncedValue(value, handleChange);

  return (
    <TextField
      size="small"
      label={filter.label}
      placeholder={filter.placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      sx={{ minWidth: 200 }}
    />
  );
}

export default function FilterBar({ filters, values, onChange }: FilterBarProps) {
  return (
    <Box className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => {
        if (filter.type === "select") {
          return (
            <TextField
              key={filter.key}
              select
              size="small"
              label={filter.label}
              value={values[filter.key] ?? ""}
              onChange={(e) => onChange(filter.key, e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filter.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        return (
          <DebouncedTextField
            key={filter.key}
            filter={filter}
            value={values[filter.key] ?? ""}
            onChange={onChange}
          />
        );
      })}
    </Box>
  );
}

export type {
  FilterBarProps,
  FilterConfig,
  FilterOption,
  SelectFilterConfig,
  TextFilterConfig,
} from "./types";
