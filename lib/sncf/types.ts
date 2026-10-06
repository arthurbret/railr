export type TransportMode =
  "tgv" | "intercites" | "ter" | "transilien" | "rer" | "tram" | "car" | "autre"

export type TrainStatus = "on-time" | "delayed" | "cancelled"

export type BoardKind = "departures" | "arrivals"

export interface Station {
  id: string
  name: string
  city?: string
  zipCode?: string
  coord?: { lat: number; lon: number }
  /** Distance in meters, only for nearby searches. */
  distance?: number
}

export interface BoardEntry {
  /** Stable key for React lists. */
  key: string
  vehicleJourneyId: string
  /** Final destination (departures) or origin (arrivals). */
  direction: string
  mode: TransportMode
  modeLabel: string
  network: string
  trainNumber: string
  /** Platform ("voie") at this station, from the SNCF SIRI Lite feed when assigned. */
  platform?: string
  /** ISO strings, timezone-naive (Europe/Paris local time). */
  baseTime: string
  realTime: string
  delayMinutes: number
  status: TrainStatus
  /** Human readable disruption explanation, if any. */
  message?: string
}

export interface Board {
  station: Pick<Station, "id" | "name">
  kind: BoardKind
  entries: BoardEntry[]
  updatedAt: string
}

export interface JourneyStop {
  stopAreaId?: string
  name: string
  platform?: string
  /** "HH:mm" local times. */
  baseArrival?: string
  baseDeparture?: string
  realArrival?: string
  realDeparture?: string
  delayMinutes: number
  skipped: boolean
}

export interface Journey {
  id: string
  trainNumber: string
  mode: TransportMode
  modeLabel: string
  network: string
  origin: string
  destination: string
  stops: JourneyStop[]
  status: TrainStatus
  delayMinutes: number
  messages: string[]
}
