import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import type { FormFieldProps } from "./types";

export default function FormField(props: FormFieldProps) {
  const {
    name,
    label,
    error,
    required = false,
    disabled = false,
    fullWidth = true,
    value,
    onChange,
  } = props;

  if (props.type === "select") {
    return (
      <TextField
        select
        id={name}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        size="medium"
        margin="normal"
      >
        {props.options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      id={name}
      name={name}
      label={label}
      type={props.type ?? "text"}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      placeholder={props.placeholder}
      multiline={props.multiline}
      rows={props.rows}
      size="medium"
      margin="normal"
    />
  );
}

export type {
  FormFieldProps,
  SelectFormFieldProps,
  SelectOption,
  TextFormFieldProps,
} from "./types";
