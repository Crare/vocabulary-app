import { useLayoutEffect, useRef } from "react";

/**
 * A ref that always holds the latest value, so stable callbacks and timers
 * can read fresh props without being recreated.
 */
export const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
