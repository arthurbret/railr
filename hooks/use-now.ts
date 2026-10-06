"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

/**
 * Current date, bucketed to `intervalMs` so it only changes once per interval.
 * Null during SSR/hydration to avoid server/client clock drift.
 */
export function useNow(intervalMs = 15_000) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const id = setInterval(onChange, intervalMs)
      return () => clearInterval(id)
    },
    [intervalMs]
  )
  const bucket = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    () => null
  )
  return useMemo(() => (bucket === null ? null : new Date(bucket)), [bucket])
}
