"use client"

import Link from "next/link"
import { ArrowUpRightIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ModeIcon } from "@/components/transport-mode"
import { stationHref } from "@/components/station-search"
import type { SavedStation } from "@/hooks/use-stations-store"
import { useFavorites } from "@/hooks/use-stations-store"
import { useBoard } from "@/lib/api"
import { formatClock, formatDelay } from "@/lib/format"
import { cn } from "@/lib/utils"

export function FavoriteStations() {
  const { favorites } = useFavorites()

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle icon={StarIcon} title="Mes gares" />
      {favorites.length === 0 ? (
        <Card>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <StarIcon />
              </EmptyMedia>
              <EmptyTitle>Pas encore de favoris</EmptyTitle>
              <EmptyDescription>
                Ouvrez une gare et touchez l&apos;étoile pour suivre ses prochains départs ici.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {favorites.map((s) => (
            <FavoriteCard key={s.id} station={s} />
          ))}
        </div>
      )}
    </section>
  )
}

function FavoriteCard({ station }: { station: SavedStation }) {
  const { data, isLoading, error } = useBoard(station.id, "departures", 4)
  const entries = data?.entries ?? []
  const issues = entries.filter((e) => e.status !== "on-time").length

  return (
    <Link href={stationHref(station.id)} className="group rounded-4xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
      <Card size="sm" className="h-full transition-shadow group-hover:shadow-lg">
        <CardHeader>
          <CardTitle className="truncate">{station.name}</CardTitle>
          <CardDescription>
            {error
              ? "Indisponible"
              : !data
                ? "Chargement…"
                : issues > 0
                  ? `${issues} train${issues > 1 ? "s" : ""} perturbé${issues > 1 ? "s" : ""}`
                  : "Trafic normal"}
          </CardDescription>
          <CardAction>
            <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {isLoading && !data
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
            : entries.slice(0, 3).map((e) => (
                <div key={e.key} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "w-11 shrink-0 font-mono font-semibold tabular",
                      e.status === "delayed" && "text-warning",
                      e.status === "cancelled" && "text-muted-foreground line-through"
                    )}
                  >
                    {formatClock(e.status === "delayed" ? e.realTime : e.baseTime)}
                  </span>
                  <ModeIcon mode={e.mode} className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{e.direction}</span>
                  {e.status === "cancelled" ? (
                    <Badge variant="destructive">Supprimé</Badge>
                  ) : e.status === "delayed" ? (
                    <Badge className="bg-warning/15 text-warning">{formatDelay(e.delayMinutes)}</Badge>
                  ) : null}
                </div>
              ))}
        </CardContent>
      </Card>
    </Link>
  )
}

export function SectionTitle({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </h2>
      {action}
    </div>
  )
}
