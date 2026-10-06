"use client"

import { useCallback, useSyncExternalStore } from "react"

export interface SavedStation {
  id: string
  name: string
  city?: string
}

type StoreKey = "railr:favorites" | "railr:recent"

const EMPTY: SavedStation[] = []
const listeners = new Set<() => void>()
const cache = new Map<StoreKey, { raw: string | null; value: SavedStation[] }>()

function migrateLegacyFavorites() {
  try {
    const legacy = localStorage.getItem("favorite-stations")
    if (legacy && !localStorage.getItem("railr:favorites")) {
      localStorage.setItem("railr:favorites", legacy)
    }
  } catch {
    // Storage unavailable (private mode): favorites simply stay empty.
  }
}

function read(key: StoreKey): SavedStation[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(key)
  } catch {
    return EMPTY
  }
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value
  let value: SavedStation[] = EMPTY
  try {
    const parsed = raw ? JSON.parse(raw) : []
    value = Array.isArray(parsed) ? parsed.filter((s) => s?.id && s?.name) : EMPTY
  } catch {
    value = EMPTY
  }
  cache.set(key, { raw, value })
  return value
}

function write(key: StoreKey, value: SavedStation[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith("railr:")) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

if (typeof window !== "undefined") migrateLegacyFavorites()

function useStore(key: StoreKey) {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY
  )
}

export function useFavorites() {
  const favorites = useStore("railr:favorites")

  const isFavorite = useCallback(
    (id: string) => favorites.some((s) => s.id === id),
    [favorites]
  )

  const toggle = useCallback((station: SavedStation) => {
    const current = read("railr:favorites")
    const exists = current.some((s) => s.id === station.id)
    write(
      "railr:favorites",
      exists ? current.filter((s) => s.id !== station.id) : [...current, station]
    )
    return !exists
  }, [])

  return { favorites, isFavorite, toggle }
}

export function useRecentStations() {
  const recent = useStore("railr:recent")

  const push = useCallback((station: SavedStation) => {
    const next = [station, ...read("railr:recent").filter((s) => s.id !== station.id)]
    write("railr:recent", next.slice(0, 6))
  }, [])

  const clear = useCallback(() => write("railr:recent", []), [])

  return { recent, push, clear }
}
