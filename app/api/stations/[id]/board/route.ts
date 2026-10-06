import { getBoard } from "@/lib/sncf/client"
import { apiError } from "@/lib/sncf/api-error"
import type { BoardKind } from "@/lib/sncf/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const search = new URL(request.url).searchParams
  const kind: BoardKind = search.get("kind") === "arrivals" ? "arrivals" : "departures"
  const count = Math.min(Math.max(Number(search.get("count")) || 20, 1), 60)

  try {
    return Response.json(await getBoard(decodeURIComponent(id), kind, count))
  } catch (error) {
    return apiError(error)
  }
}
