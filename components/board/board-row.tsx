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
import { formatClock, formatCountdown, formatDelay, minutesUntil } from "@/lib/format"
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
      <ItemMedia className="w-14 flex-col items-start gap-0 self-center font-mono tabular">
        <span
          className={cn(
            "text-lg leading-none font-semibold",
            (delayed || cancelled) && "text-sm font-normal text-muted-foreground line-through"
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
        <ItemTitle className={cn("w-full truncate", cancelled && "text-muted-foreground")}>
          <span className="sr-only">{kind === "departures" ? "Vers " : "De "}</span>
          {entry.direction}
        </ItemTitle>
        <ItemDescription className="flex items-center gap-1.5 truncate">
          <ModeIcon mode={entry.mode} className="size-3.5 shrink-0" />
          <span className="truncate">
            {entry.modeLabel} {entry.trainNumber}
            {entry.message && (delayed || cancelled) ? ` · ${entry.message}` : ""}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col items-end gap-1">
        {cancelled ? (
          <Badge variant="destructive">Supprimé</Badge>
        ) : delayed ? (
          <Badge className="bg-warning/15 text-warning">{formatDelay(entry.delayMinutes)}</Badge>
        ) : (
          <Badge className="bg-success/15 text-success">À l&apos;heure</Badge>
        )}
        {!cancelled && minutes !== null && minutes >= 0 && minutes <= 90 && (
          <span className="font-mono text-xs text-muted-foreground tabular">
            {formatCountdown(minutes)}
          </span>
        )}
      </ItemActions>
      <ChevronRightIcon className="hidden size-4 text-muted-foreground sm:block" />
    </Item>
  )
}
