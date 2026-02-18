import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import DebouncedTextField from "./DebouncedTextField";
import AutocompleteFilter from "./AutocompleteFilter";
import type {
  FilterBarProps,
  FilterConfig,
  TextFilterConfig,
  SelectFilterConfig,
  AutocompleteFilterConfig,
} from "./types";

/** Text filter with local state + debounce so keystrokes aren't lost. */
export default function FilterBar({
  filters,
  values,
  onChange,
}: FilterBarProps) {
  return (
    <Box className="flex flex-wrap items-center gap-3">
      {filters.map((filter: FilterConfig) => {
        if (filter.type === "autocomplete") {
          const f = filter as AutocompleteFilterConfig;
          return (
            <AutocompleteFilter
              key={f.key}
              filter={f}
              value={values[f.key] ?? ""}
              onChange={onChange}
            />
          );
        }

        if (filter.type === "select") {
          const f = filter as SelectFilterConfig;
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
              {f.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        const f = filter as TextFilterConfig;
        return (
          <DebouncedTextField
            key={f.key}
            filter={f}
            value={values[f.key] ?? ""}
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
