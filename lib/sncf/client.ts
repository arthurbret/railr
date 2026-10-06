import "server-only"

import type {
  Board,
  BoardEntry,
  BoardKind,
  Journey,
  JourneyStop,
  Station,
  TrainStatus,
  TransportMode,
} from "./types"

const BASE_URL = "https://api.sncf.com/v1/coverage/sncf"

export class SncfError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

async function navitia<T>(path: string, revalidate: number): Promise<T> {
  // NEXT_PUBLIC_ fallback keeps existing deployments working; it is only read server-side.
  const key = process.env.SNCF_API_KEY ?? process.env.NEXT_PUBLIC_SNCF_API_KEY
  if (!key) throw new SncfError("SNCF_API_KEY manquante", 500)

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: key },
    next: { revalidate },
  })
  if (!res.ok) {
    throw new SncfError(`Navitia ${res.status} sur ${path}`, res.status)
  }
  return res.json() as Promise<T>
}

/* -------------------------------------------------------------------------- */
/*                                Raw payloads                                */
/* -------------------------------------------------------------------------- */

interface RawCoord {
  lat: string
  lon: string
}

interface RawStopArea {
  id: string
  name: string
  coord?: RawCoord
  administrative_regions?: { name: string; zip_code?: string; level?: number }[]
}

interface RawDisplayInformations {
  direction: string
  commercial_mode: string
  physical_mode: string
  network: string
  headsign: string
  trip_short_name?: string
}

interface RawStopDateTime {
  departure_date_time: string
  base_departure_date_time?: string
  arrival_date_time: string
  base_arrival_date_time?: string
}

interface RawLink {
  type: string
  id: string
}

interface RawBoardItem {
  display_informations: RawDisplayInformations
  stop_date_time: RawStopDateTime
  stop_point?: { platform_code?: string }
  links: RawLink[]
}

interface RawImpactedStop {
  stop_point: { id: string; name: string }
  base_arrival_time?: string
  base_departure_time?: string
  amended_arrival_time?: string
  amended_departure_time?: string
  stop_time_effect?: string
  departure_status?: string
  arrival_status?: string
  cause?: string
}

interface RawDisruption {
  id: string
  severity?: { effect?: string }
  messages?: { text: string }[]
  impacted_objects?: { impacted_stops?: RawImpactedStop[] }[]
}

interface RawStopTime {
  arrival_time?: string
  departure_time?: string
  stop_point: { id: string; name: string; stop_area?: { id: string } }
}

interface RawVehicleJourney {
  id: string
  name: string
  headsign?: string
  stop_times: RawStopTime[]
  journey_pattern?: {
    route?: {
      line?: {
        commercial_mode?: { name: string }
        physical_modes?: { name: string }[]
        network?: { name: string }
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

/** "20261006T143000" -> "2026-10-06T14:30:00" */
function toIso(d: string) {
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(9, 11)}:${d.slice(11, 13)}:${d.slice(13, 15)}`
}

function minutesBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}Z`) - Date.parse(`${from}Z`)) / 60_000)
}

/** "143000" -> "14:30" */
function hhmm(time?: string) {
  if (!time) return undefined
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`
}

/** Difference in minutes between two "HHMMSS" strings, wrapping midnight. */
function timeDelta(base?: string, amended?: string) {
  if (!base || !amended) return 0
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(2, 4))
  let diff = toMin(amended) - toMin(base)
  if (diff < -720) diff += 1440
  if (diff > 720) diff -= 1440
  return diff
}

/** Strip the trailing "(City)" Navitia appends to names. */
function cleanName(name: string) {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim()
}

/** Stop points and stop areas share the UIC code: "stop_area:SNCF:87686006". */
function uic(id: string) {
  return id.match(/SNCF:(\d+)/)?.[1] ?? id
}

function detectMode(
  commercial = "",
  physical = ""
): { mode: TransportMode; label: string } {
  const c = commercial.toLowerCase()
  const p = physical.toLowerCase()
  if (c.includes("ouigo") || c.includes("tgv") || c.includes("lyria") || c.includes("eurostar") || p.includes("grande vitesse"))
    return { mode: "tgv", label: commercial || "TGV" }
  if (c.includes("intercit")) return { mode: "intercites", label: "Intercités" }
  if (c.includes("car") || p.includes("autocar") || p.includes("bus"))
    return { mode: "car", label: "Car" }
  if (c.includes("rer")) return { mode: "rer", label: "RER" }
  if (c.includes("transilien") || p.includes("transilien"))
    return { mode: "transilien", label: "Transilien" }
  if (c.includes("tram") || p.includes("tram")) return { mode: "tram", label: "Tram-train" }
  if (c.includes("ter") || p.includes("ter")) return { mode: "ter", label: commercial || "TER" }
  return { mode: "autre", label: commercial || physical || "Train" }
}

function toStation(area: RawStopArea, distance?: string): Station {
  const city =
    area.administrative_regions?.find((r) => r.level === 8) ??
    area.administrative_regions?.[0]
  return {
    id: area.id,
    name: cleanName(area.name),
    city: city?.name,
    zipCode: city?.zip_code,
    coord: area.coord
      ? { lat: Number(area.coord.lat), lon: Number(area.coord.lon) }
      : undefined,
    distance: distance ? Number(distance) : undefined,
  }
}

function impactedStopAt(d: RawDisruption | undefined, stationUic: string) {
  return d?.impacted_objects
    ?.flatMap((o) => o.impacted_stops ?? [])
    .find((s) => uic(s.stop_point.id) === stationUic)
}

/* -------------------------------------------------------------------------- */
/*                                 Endpoints                                  */
/* -------------------------------------------------------------------------- */

export async function searchStations(query: string): Promise<Station[]> {
  const data = await navitia<{
    places?: { embedded_type: string; stop_area?: RawStopArea }[]
  }>(
    `/places?q=${encodeURIComponent(query)}&type[]=stop_area&count=10&depth=1`,
    60 * 60 * 24
  )
  return (data.places ?? [])
    .filter((p) => p.embedded_type === "stop_area" && p.stop_area)
    .map((p) => toStation(p.stop_area!))
}

export async function nearbyStations(lat: number, lon: number): Promise<Station[]> {
  const data = await navitia<{
    places_nearby?: { embedded_type: string; distance: string; stop_area?: RawStopArea }[]
  }>(
    `/coords/${lon};${lat}/places_nearby?type[]=stop_area&distance=15000&count=6&depth=1`,
    60 * 60
  )
  return (data.places_nearby ?? [])
    .filter((p) => p.embedded_type === "stop_area" && p.stop_area)
    .map((p) => toStation(p.stop_area!, p.distance))
}

export async function getStation(id: string): Promise<Station> {
  const data = await navitia<{ stop_areas?: RawStopArea[] }>(
    `/stop_areas/${encodeURIComponent(id)}?depth=1`,
    60 * 60 * 24
  )
  const area = data.stop_areas?.[0]
  if (!area) throw new SncfError("Gare introuvable", 404)
  return toStation(area)
}

export async function getBoard(
  stationId: string,
  kind: BoardKind,
  count = 20
): Promise<Board> {
  const [station, data] = await Promise.all([
    getStation(stationId),
    navitia<{
      departures?: RawBoardItem[]
      arrivals?: RawBoardItem[]
      disruptions?: RawDisruption[]
    }>(
      `/stop_areas/${encodeURIComponent(stationId)}/${kind}?count=${count}&data_freshness=realtime&depth=1`,
      20
    ),
  ])

  const disruptions = new Map((data.disruptions ?? []).map((d) => [d.id, d]))
  const stationUic = uic(stationId)
  const items = (kind === "departures" ? data.departures : data.arrivals) ?? []

  const entries = items.map((item, index): BoardEntry => {
    const info = item.display_informations
    const sdt = item.stop_date_time
    const rawReal = kind === "departures" ? sdt.departure_date_time : sdt.arrival_date_time
    const rawBase =
      (kind === "departures" ? sdt.base_departure_date_time : sdt.base_arrival_date_time) ??
      rawReal
    const baseTime = toIso(rawBase)
    const realTime = toIso(rawReal)
    const delayMinutes = Math.max(0, minutesBetween(baseTime, realTime))

    const disruptionId = item.links.find((l) => l.type === "disruption")?.id
    const disruption = disruptionId ? disruptions.get(disruptionId) : undefined
    const stop = impactedStopAt(disruption, stationUic)
    const stopStatus = kind === "departures" ? stop?.departure_status : stop?.arrival_status
    const cancelled =
      disruption?.severity?.effect === "NO_SERVICE" ||
      stop?.stop_time_effect === "deleted" ||
      stopStatus === "deleted"

    const status: TrainStatus = cancelled
      ? "cancelled"
      : delayMinutes > 0
        ? "delayed"
        : "on-time"

    const { mode, label } = detectMode(info.commercial_mode, info.physical_mode)
    const vehicleJourneyId = item.links.find((l) => l.type === "vehicle_journey")?.id ?? ""
    const trainNumber = info.trip_short_name || info.headsign
    const platform = item.stop_point?.platform_code?.trim() || undefined

    return {
      key: `${vehicleJourneyId || trainNumber}-${index}`,
      vehicleJourneyId,
      direction: cleanName(info.direction),
      mode,
      modeLabel: label,
      network: info.network,
      trainNumber,
      platform,
      baseTime,
      realTime,
      delayMinutes,
      status,
      message: stop?.cause || disruption?.messages?.[0]?.text || undefined,
    }
  })

  return {
    station: { id: station.id, name: station.name },
    kind,
    entries,
    updatedAt: new Date().toISOString(),
  }
}

export async function getJourney(id: string): Promise<Journey> {
  type Payload = {
    vehicle_journeys?: RawVehicleJourney[]
    disruptions?: RawDisruption[]
  }

  let data: Payload
  try {
    data = await navitia<Payload>(`/vehicle_journeys/${encodeURIComponent(id)}?depth=3`, 30)
  } catch (error) {
    // Real-time journey ids expire quickly; fall back to the theoretical one.
    const baseId = id.replace(/:RealTime:.*$/, "")
    if (!(error instanceof SncfError) || baseId === id) throw error
    data = await navitia<Payload>(`/vehicle_journeys/${encodeURIComponent(baseId)}?depth=3`, 30)
  }

  const vj = data.vehicle_journeys?.[0]
  if (!vj) throw new SncfError("Trajet introuvable", 404)

  const disruptions = data.disruptions ?? []
  const impacted = new Map<string, RawImpactedStop>()
  for (const d of disruptions) {
    for (const o of d.impacted_objects ?? []) {
      for (const s of o.impacted_stops ?? []) impacted.set(uic(s.stop_point.id), s)
    }
  }

  const stops: JourneyStop[] = vj.stop_times.map((st) => {
    const hit = impacted.get(uic(st.stop_point.id))
    const baseArr = hit?.base_arrival_time ?? st.arrival_time
    const baseDep = hit?.base_departure_time ?? st.departure_time
    const realArr = hit?.amended_arrival_time ?? st.arrival_time
    const realDep = hit?.amended_departure_time ?? st.departure_time
    return {
      stopAreaId: st.stop_point.stop_area?.id,
      name: cleanName(st.stop_point.name),
      baseArrival: hhmm(baseArr),
      baseDeparture: hhmm(baseDep),
      realArrival: hhmm(realArr),
      realDeparture: hhmm(realDep),
      delayMinutes: Math.max(timeDelta(baseArr, realArr), timeDelta(baseDep, realDep), 0),
      skipped: hit?.stop_time_effect === "deleted",
    }
  })

  // Deleted stops can be missing from a real-time journey: put them back in order.
  const known = new Set(vj.stop_times.map((st) => uic(st.stop_point.id)))
  for (const [code, s] of impacted) {
    if (known.has(code) || s.stop_time_effect !== "deleted") continue
    const at = hhmm(s.base_arrival_time ?? s.base_departure_time) ?? ""
    const idx = stops.findIndex((x) => (x.baseArrival ?? x.baseDeparture ?? "") > at)
    stops.splice(idx === -1 ? stops.length : idx, 0, {
      name: cleanName(s.stop_point.name),
      baseArrival: hhmm(s.base_arrival_time),
      baseDeparture: hhmm(s.base_departure_time),
      delayMinutes: 0,
      skipped: true,
    })
  }

  const cancelled =
    disruptions.some((d) => d.severity?.effect === "NO_SERVICE") ||
    (stops.length > 0 && stops.every((s) => s.skipped))
  const delayMinutes = Math.max(0, ...stops.map((s) => s.delayMinutes))
  const line = vj.journey_pattern?.route?.line
  const { mode, label } = detectMode(
    line?.commercial_mode?.name,
    line?.physical_modes?.[0]?.name
  )

  return {
    id: vj.id,
    trainNumber: vj.headsign || vj.name,
    mode,
    modeLabel: label,
    network: line?.network?.name ?? "SNCF",
    origin: stops[0]?.name ?? "",
    destination: stops.at(-1)?.name ?? "",
    stops,
    status: cancelled ? "cancelled" : delayMinutes > 0 ? "delayed" : "on-time",
    delayMinutes,
    messages: [
      ...new Set(
        disruptions.flatMap((d) => d.messages?.map((m) => m.text) ?? []).filter(Boolean)
      ),
    ],
  }
}
