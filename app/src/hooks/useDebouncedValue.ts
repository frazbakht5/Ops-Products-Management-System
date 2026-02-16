import { useEffect, useRef, useState } from "react";

import { useDebounce } from "./useDebounce";

export function useDebouncedValue(
  value: string,
  onChange: (next: string) => void,
  delay = 300,
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, delay);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const lastEmittedRef = useRef(value);

  useEffect(() => {
    if (debouncedValue !== lastEmittedRef.current) {
      lastEmittedRef.current = debouncedValue;
      onChangeRef.current(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      const id = setTimeout(() => {
        setLocalValue(value);
        lastEmittedRef.current = value;
      }, 0);
      return () => clearTimeout(id);
    }
    lastEmittedRef.current = value;
    return undefined;
  }, [value]);

  return [localValue, setLocalValue];
}
