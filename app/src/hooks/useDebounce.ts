import { useEffect, useState } from "react";

/**
 * Debounces a value by the specified delay in milliseconds.
 * Returns the debounced value that only updates after the delay has elapsed
 * since the last change.
 */
export function useDebounce<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
