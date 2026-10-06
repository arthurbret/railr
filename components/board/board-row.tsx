"use client"

import { ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ModeIcon } from "@/components/transport-mode"
import {
  formatClock,
  formatCountdown,
  formatDelay,
  minutesUntil,
} from "@/lib/format"
import type { BoardEntry, BoardKind } from "@/lib/sncf/types"
import { cn } from "@/lib/utils"

export function BoardRow({
  entry,
  kind,
  now,
  onSelect,
}: {
  entry: BoardEntry
  kind: BoardKind
  now: Date | null
  onSelect: (entry: BoardEntry) => void
}) {
  const cancelled = entry.status === "cancelled"
  const delayed = entry.status === "delayed"
  const minutes = now ? minutesUntil(entry.realTime, now) : null

  return (
    <Item
      size="sm"
      render={<button type="button" />}
      onClick={() => onSelect(entry)}
      className="cursor-pointer text-left hover:bg-muted/60"
    >
      <ItemMedia className="tabular w-14 flex-col items-start gap-0 self-center font-mono">
        <span
          className={cn(
            "text-lg leading-none font-semibold",
            (delayed || cancelled) &&
              "text-sm font-normal text-muted-foreground line-through"
          )}
        >
          {formatClock(entry.baseTime)}
        </span>
        {delayed && (
          <span className="text-lg leading-tight font-semibold text-warning">
            {formatClock(entry.realTime)}
          </span>
        )}
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle
          className={cn(
            "w-full truncate",
            cancelled && "text-muted-foreground"
          )}
        >
          <span className="sr-only">
            {kind === "departures" ? "Vers " : "De "}
          </span>
          {entry.direction}
        </ItemTitle>
        <ItemDescription className="flex items-center gap-1.5 truncate">
          <ModeIcon mode={entry.mode} className="size-3.5 shrink-0" />
          <span className="truncate">
            {entry.modeLabel} {entry.trainNumber}
            {entry.message && (delayed || cancelled)
              ? ` · ${entry.message}`
              : ""}
          </span>
        </ItemDescription>
      </ItemContent>
      {/* Fixed-width column keeps rows aligned whether or not the platform is known yet. */}
      <ItemActions className="w-12 flex-col items-center justify-center gap-0.5 text-center">
        {entry.platform && !cancelled ? (
          <>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Voie
            </span>
            <span className="max-w-12 truncate font-mono text-lg leading-none font-semibold">
              {entry.platform}
            </span>
          </>
        ) : (
          <span className="sr-only">Voie non attribuée</span>
        )}
      </ItemActions>
      <ItemActions className="flex-col items-end gap-1">
        {cancelled ? (
          <Badge variant="destructive">Supprimé</Badge>
        ) : delayed ? (
          <Badge className="bg-warning/15 text-warning">
            {formatDelay(entry.delayMinutes)}
          </Badge>
        ) : (
          <Badge className="bg-success/15 text-success">À l&apos;heure</Badge>
        )}
        {!cancelled && minutes !== null && minutes >= 0 && minutes <= 90 && (
          <span className="tabular font-mono text-xs text-muted-foreground">
            {formatCountdown(minutes)}
          </span>
        )}
      </ItemActions>
      <ChevronRightIcon className="hidden size-4 text-muted-foreground sm:block" />
    </Item>
  )
}
