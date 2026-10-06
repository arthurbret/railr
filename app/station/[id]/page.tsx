import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MapPinIcon } from "lucide-react"

import { StationBoard } from "@/components/board/station-board"
import { StationActions } from "@/components/station-actions"
import { getStation, SncfError } from "@/lib/sncf/client"

type Props = { params: Promise<{ id: string }> }

async function loadStation(rawId: string) {
  try {
    return await getStation(decodeURIComponent(rawId))
  } catch (error) {
    if (error instanceof SncfError && (error.status === 404 || error.status === 400)) notFound()
    throw error
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const station = await loadStation(id)
  return {
    title: `${station.name} — départs et arrivées`,
    description: `Prochains trains en gare de ${station.name} en temps réel : retards, suppressions et détail des trajets.`,
  }
}

export default async function StationPage({ params }: Props) {
  const { id } = await params
  const station = await loadStation(id)

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{station.name}</h1>
          {station.city && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon className="size-3.5" />
              {station.city}
              {station.zipCode && ` (${station.zipCode.slice(0, 2)})`}
            </p>
          )}
        </div>
        <StationActions station={{ id: station.id, name: station.name, city: station.city }} />
      </div>
      <StationBoard stationId={station.id} />
      <p className="text-center text-xs text-muted-foreground">
        Données temps réel SNCF. Les informations peuvent différer de l&apos;affichage en gare.
      </p>
    </main>
  )
}
