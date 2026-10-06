"use client"

import Link from "next/link"
import { HistoryIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SearchTrigger, stationHref } from "@/components/station-search"
import { useRecentStations } from "@/hooks/use-stations-store"

const SUGGESTIONS = [
  { id: "stop_area:SNCF:87686006", name: "Paris Gare de Lyon" },
  { id: "stop_area:SNCF:87723197", name: "Lyon Part-Dieu" },
  { id: "stop_area:SNCF:87751008", name: "Marseille St-Charles" },
  { id: "stop_area:SNCF:87581009", name: "Bordeaux St-Jean" },
]

export function HeroSearch() {
  const { recent } = useRecentStations()
  const shortcuts = recent.length > 0 ? recent.slice(0, 4) : SUGGESTIONS

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <SearchTrigger
        placeholder="Où êtes-vous ? Cherchez une gare…"
        className="h-14 bg-background px-2 shadow-lg ring-1 ring-foreground/5 *:data-[slot=input-group-control]:text-base"
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {recent.length > 0 && (
          <HistoryIcon className="size-3.5 text-muted-foreground" />
        )}
        {shortcuts.map((s) => (
          <Badge
            key={s.id}
            variant="outline"
            className="h-7 px-3"
            render={<Link href={stationHref(s.id)} />}
          >
            {s.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
