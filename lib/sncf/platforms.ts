import "server-only"

/**
 * Platforms ("voies") from the SNCF SIRI Lite Estimated Timetable feed.
 * Navitia rarely exposes platforms; this national feed does (TGV, Intercités, TER, Transilien).
 * https://transport.data.gouv.fr/datasets/horaires-sncf
 */
const FEED_URL =
  "https://proxy.transport.data.gouv.fr/resource/sncf-siri-lite-estimated-timetable"

/** The feed is ~17 MB: refresh at most once a minute per server instance. */
const TTL_MS = 60_000
/** Keep serving the last good table while the feed is down. */
const STALE_MS = 15 * 60_000

export interface StopPlatforms {
  departure?: string
  arrival?: string
}

type PlatformTable = Map<string, StopPlatforms>

let table: PlatformTable = new Map()
let fetchedAt = 0
let attemptedAt = 0
let inflight: Promise<void> | null = null

function key(trainNumber: string, uic: string, date: string) {
  return `${trainNumber}|${uic}|${date}`
}

function tag(xml: string, name: string) {
  const start = xml.indexOf(`<${name}>`)
  if (start === -1) return undefined
  const end = xml.indexOf(`</${name}>`, start)
  const value = xml.slice(start + name.length + 2, end).trim()
  return value || undefined
}

export function parseFeed(xml: string): PlatformTable {
  const result: PlatformTable = new Map()
  const journeys = xml.split("<EstimatedVehicleJourney>").slice(1)

  for (const journey of journeys) {
    // A train can change number along its route (e.g. 6919/6918): index all of them.
    const numbers = [
      ...journey.matchAll(/<TrainNumberRef>([^<]+)<\/TrainNumberRef>/g),
    ].map((m) => m[1].trim())
    if (numbers.length === 0) continue

    for (const call of journey.matchAll(
      /<(?:Recorded|Estimated)Call>([\s\S]*?)<\/(?:Recorded|Estimated)Call>/g
    )) {
      const body = call[1]
      const departure = tag(body, "DeparturePlatformName")
      const arrival = tag(body, "ArrivalPlatformName")
      if (!departure && !arrival) continue

      const uic = tag(body, "StopPointRef")?.match(/(\d{8})/)?.[1]
      // Aimed times carry the Paris offset, so the first 10 chars are the local date.
      const date = (
        tag(body, "AimedDepartureTime") ?? tag(body, "AimedArrivalTime")
      )?.slice(0, 10)
      if (!uic || !date) continue

      for (const n of numbers)
        result.set(key(n, uic, date), { departure, arrival })
    }
  }
  return result
}

async function refresh() {
  attemptedAt = Date.now()
  try {
    const res = await fetch(FEED_URL, {
      // Too large for the Next data cache (2 MB limit): cached in memory instead.
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) throw new Error(`SIRI Lite ${res.status}`)
    table = parseFeed(await res.text())
    fetchedAt = Date.now()
  } catch (error) {
    console.error("Platforms feed unavailable:", error)
    if (Date.now() - fetchedAt > STALE_MS) table = new Map()
  }
}

/** Platform lookup for the current feed snapshot. Never throws. */
export async function getPlatforms() {
  if (Date.now() - attemptedAt > TTL_MS) {
    inflight ??= refresh().finally(() => {
      inflight = null
    })
  }
  // First load blocks; later refreshes serve the previous table meanwhile.
  if (fetchedAt === 0 && inflight) await inflight
  const snapshot = table
  return (trainNumber: string, stationId: string, date: string) => {
    const uic = stationId.match(/(\d{8})/)?.[1]
    return uic ? snapshot.get(key(trainNumber, uic, date)) : undefined
  }
}
