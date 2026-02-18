export interface FilterOption {
  label: string;
  value: string;
}

interface BaseFilterConfig {
  /** Unique key — maps to the query-param / filter key. */
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

export interface AutocompleteFilterConfig extends BaseFilterConfig {
  type: "autocomplete";
  options: FilterOption[];
  placeholder?: string;
}

export type FilterConfig = TextFilterConfig | SelectFilterConfig | AutocompleteFilterConfig;

export interface FilterBarProps {
  filters: FilterConfig[];
  /** Current filter values keyed by filter `key`. */
  values: Record<string, string>;
  /** Called when any filter value changes. */
  onChange: (key: string, value: string) => void;
}
