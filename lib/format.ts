/** "2026-10-06T14:30:00" -> "14:30" */
export function formatClock(iso: string) {
  return iso.slice(11, 16)
}

/** Current wall-clock time in Paris as a timezone-naive ISO string. */
export function parisNowIso(now = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now)
  return parts.replace(" ", "T")
}

/** Minutes from now (Paris time) until a timezone-naive ISO date. */
export function minutesUntil(iso: string, now = new Date()) {
  return Math.round(
    (Date.parse(`${iso}Z`) - Date.parse(`${parisNowIso(now)}Z`)) / 60_000
  )
}

export function formatCountdown(minutes: number) {
  if (minutes <= 0) return "maintenant"
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`
}

export function formatDelay(minutes: number) {
  return minutes >= 60
    ? `+${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`
    : `+${minutes} min`
}

export function formatDistance(meters: number) {
  return meters < 1000
    ? `${Math.round(meters / 10) * 10} m`
    : `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`
}
