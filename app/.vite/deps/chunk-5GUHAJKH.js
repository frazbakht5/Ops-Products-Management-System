import {
  useForkRef
} from "./chunk-UH6YSXOI.js";
import {
  useEnhancedEffect_default
} from "./chunk-RSNLGFCK.js";
import {
  require_react
} from "./chunk-NO6UH6X3.js";
import {
  __toESM
} from "./chunk-5WRI5ZAA.js";

// node_modules/@mui/material/esm/utils/useForkRef.js
var useForkRef_default = useForkRef;

// node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js
var React = __toESM(require_react(), 1);
function useEventCallback(fn) {
  const ref = React.useRef(fn);
  useEnhancedEffect_default(() => {
    ref.current = fn;
  });
  return React.useRef((...args) => (
    // @ts-expect-error hide `this`
    (0, ref.current)(...args)
  )).current;
}
var useEventCallback_default = useEventCallback;

export {
  useForkRef_default,
  useEventCallback_default
};
//# sourceMappingURL=chunk-5GUHAJKH.js.map
