import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { SearchBarProps } from "./types";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  delay = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useDebouncedValue(value, onChange, delay);

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{ minWidth: 220 }}
    />
  );
}

export type { SearchBarProps };
