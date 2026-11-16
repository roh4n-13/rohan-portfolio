"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a media query the React-recommended way (no setState inside
 * effects, no hydration mismatch: the server snapshot is always false and
 * the client re-syncs after hydration).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the user prefers reduced motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only on devices with a fine pointer (mouse/trackpad), not touch. */
export function useFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}
