import { getJourney } from "@/lib/sncf/client"
import { apiError } from "@/lib/sncf/api-error"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    return Response.json(await getJourney(decodeURIComponent(id)))
  } catch (error) {
    return apiError(error)
  }
}
