import { nearbyStations } from "@/lib/sncf/client"
import { apiError } from "@/lib/sncf/api-error"

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const lat = Number(params.get("lat"))
  const lon = Number(params.get("lon"))
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "Coordonnées invalides" }, { status: 400 })
  }

  try {
    // Round to ~100m so nearby requests share the cache.
    const round = (n: number) => Math.round(n * 1000) / 1000
    return Response.json({ stations: await nearbyStations(round(lat), round(lon)) })
  } catch (error) {
    return apiError(error)
  }
}
