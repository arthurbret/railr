import { searchStations } from "@/lib/sncf/client"
import { apiError } from "@/lib/sncf/api-error"

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? ""
  if (q.length < 2) return Response.json({ stations: [] })

  try {
    return Response.json({ stations: await searchStations(q) })
  } catch (error) {
    return apiError(error)
  }
}
