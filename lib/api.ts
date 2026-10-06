"use client"

import useSWR from "swr"

import type { Board, BoardKind, Journey, Station } from "@/lib/sncf/types"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(body.error ?? "Erreur réseau", res.status)
  return body as T
}

export function useStationSearch(query: string) {
  const q = query.trim()
  return useSWR<{ stations: Station[] }>(
    q.length >= 2 ? `/api/stations/search?q=${encodeURIComponent(q)}` : null,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false }
  )
}

export function useNearbyStations(coords: { lat: number; lon: number } | null) {
  return useSWR<{ stations: Station[] }>(
    coords ? `/api/stations/nearby?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )
}

export const BOARD_REFRESH_MS = 30_000

export function useBoard(stationId: string, kind: BoardKind, count = 20) {
  return useSWR<Board>(
    `/api/stations/${encodeURIComponent(stationId)}/board?kind=${kind}&count=${count}`,
    fetcher,
    { refreshInterval: BOARD_REFRESH_MS, keepPreviousData: true }
  )
}

export function useJourney(id: string | null) {
  return useSWR<Journey>(
    id ? `/api/journeys/${encodeURIComponent(id)}` : null,
    fetcher,
    { refreshInterval: 60_000 }
  )
}
