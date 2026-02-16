import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "../../hooks/useDebounce";

export interface SearchBarProps {
  /** Current search value (controlled). */
  value: string;
  /** Called with the debounced search term. */
  onChange: (value: string) => void;
  /** Placeholder text. */
  placeholder?: string;
  /** Debounce delay in ms (default 300). */
  delay?: number;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  delay = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, delay);

  // Sync outward when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Sync inward when controlled value changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
