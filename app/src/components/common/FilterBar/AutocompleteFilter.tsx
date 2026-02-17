import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { AutocompleteFilterConfig } from "./types";

export default function AutocompleteFilter({
  filter,
  value,
  onChange,
}: {
  filter: AutocompleteFilterConfig;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const selected = filter.options.find((o) => o.value === value) ?? null;

  return (
    <Autocomplete
      size="small"
      options={filter.options}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      value={selected}
      onChange={(_, newVal) => onChange(filter.key, newVal?.value ?? "")}
      renderInput={(params) => (
        <TextField {...params} label={filter.label} placeholder={filter.placeholder} />
      )}
      sx={{ minWidth: 220 }}
    />
  );
}
