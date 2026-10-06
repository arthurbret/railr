"use client"

import { useMemo, useState } from "react"
import { RefreshCwIcon, TrainTrackIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ItemGroup, ItemSeparator } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BoardRow } from "@/components/board/board-row"
import { JourneyDrawer } from "@/components/journey/journey-drawer"
import { MODES, ModeIcon } from "@/components/transport-mode"
import { useNow } from "@/hooks/use-now"
import { useBoard } from "@/lib/api"
import type { BoardEntry, BoardKind, TransportMode } from "@/lib/sncf/types"

export function StationBoard({ stationId }: { stationId: string }) {
  const [kind, setKind] = useState<BoardKind>("departures")
  const [count, setCount] = useState(20)
  const [mode, setMode] = useState<TransportMode | "all">("all")
  const [selected, setSelected] = useState<BoardEntry | null>(null)
  const now = useNow()
  const { data, error, isLoading, isValidating, mutate } = useBoard(stationId, kind, count)

  const modes = useMemo(
    () => [...new Set((data?.entries ?? []).map((e) => e.mode))],
    [data]
  )
  const entries = useMemo(
    () => (data?.entries ?? []).filter((e) => mode === "all" || e.mode === mode),
    [data, mode]
  )
  const stats = useMemo(() => {
    const all = data?.entries ?? []
    return {
      delayed: all.filter((e) => e.status === "delayed").length,
      cancelled: all.filter((e) => e.status === "cancelled").length,
    }
  }, [data])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={kind}
          onValueChange={(v) => {
            setKind(v as BoardKind)
            setMode("all")
          }}
        >
          <TabsList>
            <TabsTrigger value="departures">Départs</TabsTrigger>
            <TabsTrigger value="arrivals">Arrivées</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="tabular">
            En direct
            {data &&
              ` · ${new Date(data.updatedAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Paris",
              })}`}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Actualiser"
            onClick={() => mutate()}
            disabled={isValidating}
          >
            {isValidating ? <Spinner /> : <RefreshCwIcon />}
          </Button>
        </div>
      </div>

      {modes.length > 1 && (
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[mode]}
          onValueChange={(v) => v[0] && setMode(v[0] as TransportMode | "all")}
          className="flex-wrap"
        >
          <ToggleGroupItem value="all">Tous</ToggleGroupItem>
          {modes.map((m) => (
            <ToggleGroupItem key={m} value={m}>
              <ModeIcon mode={m} />
              {MODES[m].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}

      {(stats.delayed > 0 || stats.cancelled > 0) && (
        <p className="text-sm text-muted-foreground">
          {stats.delayed > 0 && (
            <span className="font-medium text-warning">
              {stats.delayed} en retard
            </span>
          )}
          {stats.delayed > 0 && stats.cancelled > 0 && " · "}
          {stats.cancelled > 0 && (
            <span className="font-medium text-destructive">
              {stats.cancelled} supprimé{stats.cancelled > 1 ? "s" : ""}
            </span>
          )}
          {` sur les ${data?.entries.length} prochains trains`}
        </p>
      )}

      {error && !data ? (
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>Impossible de charger les horaires</AlertTitle>
          <AlertDescription>
            {error.message}. Réessayez dans quelques instants.
          </AlertDescription>
        </Alert>
      ) : isLoading && !data ? (
        <BoardSkeleton />
      ) : entries.length === 0 ? (
        <Card>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrainTrackIcon />
              </EmptyMedia>
              <EmptyTitle>Aucun train prévu</EmptyTitle>
              <EmptyDescription>
                Pas de {kind === "departures" ? "départ" : "arrivée"} dans les prochaines heures
                pour ce filtre.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <Card className="py-2">
          <ItemGroup className="px-2">
            {entries.map((entry, i) => (
              <div key={entry.key}>
                {i > 0 && <ItemSeparator />}
                <BoardRow entry={entry} kind={kind} now={now} onSelect={setSelected} />
              </div>
            ))}
          </ItemGroup>
        </Card>
      )}

      {data && data.entries.length >= count && count < 60 && (
        <Button
          variant="outline"
          className="self-center"
          onClick={() => setCount((c) => c + 20)}
          disabled={isValidating}
        >
          {isValidating && <Spinner data-icon="inline-start" />}
          Voir plus de trains
        </Button>
      )}

      <JourneyDrawer
        entry={selected}
        stationId={stationId}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

function BoardSkeleton() {
  return (
    <Card className="gap-0 py-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3">
          <Skeleton className="h-5 w-12" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </Card>
  )
}
