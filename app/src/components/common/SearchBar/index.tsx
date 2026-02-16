import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { useDebounce } from "../../../hooks/useDebounce";
import type { SearchBarProps } from "./types";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  delay = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, delay);
  const lastEmittedRef = useRef(value);

  useEffect(() => {
    if (debouncedValue !== value) {
      lastEmittedRef.current = debouncedValue;
      onChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    // Only sync from parent when it is an external change,
    // not our own emission echoing back, so we don't lose keystrokes.
    if (value !== lastEmittedRef.current) {
      setLocalValue(value);
    }
    lastEmittedRef.current = value;
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

export type { SearchBarProps };
