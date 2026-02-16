export interface SelectOption {
  label: string;
  value: string;
}

interface BaseFormFieldProps {
  name: string;
  label: string;
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
