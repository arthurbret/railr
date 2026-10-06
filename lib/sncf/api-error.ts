import "server-only"

import { SncfError } from "./client"

export function apiError(error: unknown) {
  if (error instanceof SncfError) {
    const status = error.status === 404 || error.status === 400 ? 404 : 502
    console.error(error.message)
    return Response.json(
      { error: status === 404 ? "Introuvable" : "Service SNCF indisponible" },
      { status }
    )
  }
  console.error(error)
  return Response.json({ error: "Erreur inattendue" }, { status: 500 })
}
