import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

type ParamValue = string | number | undefined;
type Params = Record<string, ParamValue>;

/**
 * Syncs filter / pagination / sort state to URL query params via useSearchParams.
 * On mount it reads params from the URL (so state persists on refresh).
 *
 * @param defaults – default values used when a param is missing from the URL.
 * @returns [params, setParams] tuple.
 */
export function useUrlParams<T extends Params>(
  defaults: T,
): [T, (patch: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const result = { ...defaults };

    for (const key of Object.keys(defaults)) {
      const urlValue = searchParams.get(key);
      if (urlValue !== null) {
        const defaultValue = defaults[key];
        // Coerce to number when the default is numeric
        if (typeof defaultValue === "number") {
          const parsed = Number(urlValue);
          (result as Record<string, ParamValue>)[key] = Number.isNaN(parsed)
            ? defaultValue
            : parsed;
        } else {
          (result as Record<string, ParamValue>)[key] = urlValue;
        }
      }
    }

    return result;
  }, [searchParams, defaults]);

  const setParams = useCallback(
    (patch: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        for (const [key, value] of Object.entries(patch)) {
          if (
            value === undefined ||
            value === "" ||
            String(value) === String(defaults[key])
          ) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        }

        return next;
      });
    },
    [setSearchParams, defaults],
  );

  return [params, setParams];
}
