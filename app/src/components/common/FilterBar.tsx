import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface FilterOption {
  label: string;
  value: string;
}

interface BaseFilterConfig {
  /** Unique key — maps to the query‑param / filter key. */
  key: string;
  /** Label shown above the control. */
  label: string;
}

export interface TextFilterConfig extends BaseFilterConfig {
  type: "text";
  placeholder?: string;
}

export interface SelectFilterConfig extends BaseFilterConfig {
  type: "select";
  options: FilterOption[];
}

export type FilterConfig = TextFilterConfig | SelectFilterConfig;

export interface FilterBarProps {
  filters: FilterConfig[];
  /** Current filter values keyed by filter `key`. */
  values: Record<string, string>;
  /** Called when any filter value changes. */
  onChange: (key: string, value: string) => void;
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function FilterBar({
  filters,
  values,
  onChange,
}: FilterBarProps) {
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

        // type === "text"
        return (
          <TextField
            key={filter.key}
            size="small"
            label={filter.label}
            placeholder={filter.placeholder}
            value={values[filter.key] ?? ""}
            onChange={(e) => onChange(filter.key, e.target.value)}
            sx={{ minWidth: 200 }}
          />
        );
      })}
    </Box>
  );
}
