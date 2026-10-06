"use client"

import Link from "next/link"
import { HistoryIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { stationHref, useSearch } from "@/components/station-search"
import { useRecentStations } from "@/hooks/use-stations-store"

const SUGGESTIONS = [
  { id: "stop_area:SNCF:87686006", name: "Paris Gare de Lyon" },
  { id: "stop_area:SNCF:87723197", name: "Lyon Part-Dieu" },
  { id: "stop_area:SNCF:87751008", name: "Marseille St-Charles" },
  { id: "stop_area:SNCF:87581009", name: "Bordeaux St-Jean" },
]

export function HeroSearch() {
  const { open } = useSearch()
  const { recent } = useRecentStations()
  const shortcuts = recent.length > 0 ? recent.slice(0, 4) : SUGGESTIONS

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <Button
        size="lg"
        variant="outline"
        onClick={open}
        className="h-14 w-full justify-start rounded-full bg-background px-5 text-base text-muted-foreground shadow-lg shadow-primary/5"
      >
        <SearchIcon data-icon="inline-start" />
        Où êtes-vous ? Cherchez une gare…
        <KbdGroup className="ml-auto hidden sm:inline-flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {recent.length > 0 && <HistoryIcon className="size-3.5 text-muted-foreground" />}
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
