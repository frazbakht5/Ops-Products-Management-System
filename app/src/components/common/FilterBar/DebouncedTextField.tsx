import { useCallback } from "react";
import TextField from "@mui/material/TextField";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { TextFilterConfig } from "./types";

export default function DebouncedTextField({
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
