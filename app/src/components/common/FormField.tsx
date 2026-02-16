import TextField, { type TextFieldProps } from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseFormFieldProps {
  /** Field name (used as `name` and `id`). */
  name: string;
  label: string;
  /** Validation error message. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface TextFormFieldProps extends BaseFormFieldProps {
  type?: "text" | "number" | "email" | "tel";
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  inputProps?: TextFieldProps["inputProps"];
}

export interface SelectFormFieldProps extends BaseFormFieldProps {
  type: "select";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  options: SelectOption[];
}

export type FormFieldProps = TextFormFieldProps | SelectFormFieldProps;

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

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
      inputProps={props.inputProps}
      size="medium"
      margin="normal"
    />
  );
}
