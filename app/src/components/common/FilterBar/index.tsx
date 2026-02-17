import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import DebouncedTextField from "./DebouncedTextField";
import AutocompleteFilter from "./AutocompleteFilter";
import type { FilterBarProps } from "./types";

/** Text filter with local state + debounce so keystrokes aren't lost. */
export default function FilterBar({ filters, values, onChange }: FilterBarProps) {
  return (
    <Box className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => {
        if ((filter as any).type === "autocomplete") {
          return (
            <AutocompleteFilter
              key={filter.key}
              filter={filter as any}
              value={values[filter.key] ?? ""}
              onChange={onChange}
            />
          );
        }

        if ((filter as any).type === "select") {
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
  AutocompleteFilterConfig,
  FilterBarProps,
  FilterConfig,
  FilterOption,
  SelectFilterConfig,
  TextFilterConfig,
} from "./types";
