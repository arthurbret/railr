"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { ModeIcon } from "@/components/transport-mode"
import { stationHref } from "@/components/station-search"
import { useNow } from "@/hooks/use-now"
import { useJourney } from "@/lib/api"
import { formatDelay, parisNowIso } from "@/lib/format"
import type { BoardEntry, Journey, JourneyStop } from "@/lib/sncf/types"
import { cn } from "@/lib/utils"

export function JourneyDrawer({
  entry,
  stationId,
  onClose,
}: {
  entry: BoardEntry | null
  stationId: string
  onClose: () => void
}) {
  // Keep the last entry rendered while the close animation plays.
  const [shown, setShown] = useState(entry)
  if (entry && entry !== shown) setShown(entry)
  const { data, error, isLoading } = useJourney(shown?.vehicleJourneyId || null)

  return (
    <Drawer open={entry !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="sm:mx-auto sm:w-full sm:max-w-xl">
        {shown && (
          <>
            <DrawerHeader className="gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ModeIcon mode={shown.mode} className="size-3.5" />
                {shown.modeLabel} n° {shown.trainNumber}
                <StatusBadge status={data?.status ?? shown.status} delay={data?.delayMinutes ?? shown.delayMinutes} />
              </div>
              <DrawerTitle className="flex flex-wrap items-center gap-x-2 text-xl">
                {data ? (
                  <>
                    {data.origin}
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                    {data.destination}
                  </>
                ) : (
                  shown.direction
                )}
              </DrawerTitle>
              <DrawerDescription>{shown.network}</DrawerDescription>
            </DrawerHeader>
            <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-6">
              {data?.messages.map((m) => (
                <Alert key={m}>
                  <InfoIcon />
                  <AlertDescription>{m}</AlertDescription>
                </Alert>
              ))}
              {error ? (
                <Alert variant="destructive">
                  <TriangleAlertIcon />
                  <AlertDescription>
                    Le détail de ce trajet n&apos;est pas disponible pour le moment.
                  </AlertDescription>
                </Alert>
              ) : isLoading || !data ? (
                <TimelineSkeleton />
              ) : (
                <Timeline journey={data} stationId={stationId} onNavigate={onClose} />
              )}
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

function StatusBadge({ status, delay }: { status: Journey["status"]; delay: number }) {
  if (status === "cancelled") return <Badge variant="destructive">Supprimé</Badge>
  if (status === "delayed")
    return <Badge className="bg-warning/15 text-warning">{formatDelay(delay)}</Badge>
  return <Badge className="bg-success/15 text-success">À l&apos;heure</Badge>
}

function stopTime(stop: JourneyStop, which: "real" | "base") {
  return which === "real"
    ? (stop.realDeparture ?? stop.realArrival)
    : (stop.baseDeparture ?? stop.baseArrival)
}

function Timeline({
  journey,
  stationId,
  onNavigate,
}: {
  journey: Journey
  stationId: string
  onNavigate: () => void
}) {
  const now = useNow(30_000)
  const nowHhmm = now ? parisNowIso(now).slice(11, 16) : null
  const firstTime = stopTime(journey.stops[0], "real") ?? ""
  // Stops already served today (ignores trips crossing midnight once past it).
  const passed = (stop: JourneyStop) => {
    const t = stopTime(stop, "real")
    if (!nowHhmm || !t || stop.skipped) return false
    if (nowHhmm < firstTime) return false
    return t <= nowHhmm
  }
  const lastPassed = journey.stops.findLastIndex(passed)

  return (
    <ol className="relative flex flex-col">
      {journey.stops.map((stop, i) => {
        const isCurrent = stop.stopAreaId === stationId
        const isPassed = i <= lastPassed
        const isFirst = i === 0
        const isLast = i === journey.stops.length - 1
        const delayed = stop.delayMinutes > 0 && !stop.skipped
        const time = stopTime(stop, "real")
        const base = stopTime(stop, "base")

        return (
          <li key={`${stop.name}-${i}`} className="relative flex gap-3">
            <div className="flex w-14 shrink-0 flex-col items-end pt-2.5 font-mono text-sm tabular">
              {delayed ? (
                <>
                  <span className="text-xs text-muted-foreground line-through">{base}</span>
                  <span className="font-semibold text-warning">{time}</span>
                </>
              ) : (
                <span
                  className={cn(
                    "font-medium",
                    stop.skipped && "text-muted-foreground line-through",
                    isPassed && "text-muted-foreground"
                  )}
                >
                  {base ?? time}
                </span>
              )}
            </div>
            <div className="relative flex w-4 shrink-0 justify-center">
              {!isFirst && (
                <span
                  className={cn(
                    "absolute top-0 h-3.5 w-0.5",
                    i <= lastPassed ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              {!isLast && (
                <span
                  className={cn(
                    "absolute top-3.5 bottom-0 w-0.5",
                    i < lastPassed ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative mt-2 size-3 rounded-full border-2 bg-background",
                  isPassed ? "border-primary bg-primary" : "border-border",
                  (isFirst || isLast) && "size-3.5",
                  isCurrent && "ring-4 ring-primary/20 border-primary",
                  stop.skipped && "border-destructive bg-background"
                )}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-2">
              {stop.stopAreaId ? (
                <Link
                  href={stationHref(stop.stopAreaId)}
                  onClick={onNavigate}
                  className={cn(
                    "truncate font-medium hover:underline",
                    isPassed && "text-muted-foreground",
                    stop.skipped && "text-muted-foreground line-through",
                    isCurrent && "text-primary"
                  )}
                >
                  {stop.name}
                </Link>
              ) : (
                <span className="truncate font-medium text-muted-foreground line-through">
                  {stop.name}
                </span>
              )}
              {stop.skipped ? (
                <span className="text-xs text-destructive">Arrêt supprimé</span>
              ) : delayed ? (
                <span className="text-xs text-warning">{formatDelay(stop.delayMinutes)}</span>
              ) : isCurrent ? (
                <span className="text-xs text-muted-foreground">Votre gare</span>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function TimelineSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}
