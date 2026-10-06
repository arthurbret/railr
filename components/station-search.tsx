"use client"

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { HistoryIcon, MapPinIcon, StarIcon, TrashIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"
import { useStationSearch } from "@/lib/api"
import type { SavedStation } from "@/hooks/use-stations-store"
import { useFavorites, useRecentStations } from "@/hooks/use-stations-store"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

const SearchContext = createContext<{ open: () => void } | null>(null)

export function useSearch() {
  const ctx = use(SearchContext)
  if (!ctx) throw new Error("useSearch must be used within SearchProvider")
  return ctx
}

export function stationHref(id: string) {
  return `/station/${encodeURIComponent(id)}`
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 250)
  const { data, isLoading } = useStationSearch(debounced)
  const { favorites } = useFavorites()
  const { recent, push, clear } = useRecentStations()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const go = useCallback(
    (station: SavedStation) => {
      push(station)
      setOpen(false)
      setQuery("")
      router.push(stationHref(station.id))
    },
    [push, router]
  )

  const ctx = useMemo(() => ({ open: () => setOpen(true) }), [])
  const searching = query.trim().length >= 2
  const results = searching ? (data?.stations ?? []) : []
  const pending = searching && (isLoading || query !== debounced)

  return (
    <SearchContext value={ctx}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Rechercher une gare"
        description="Tapez le nom d'une gare SNCF"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Paris Gare de Lyon, Lille Flandres…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {searching ? (
              <>
                <CommandEmpty>
                  {pending ? (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Spinner /> Recherche…
                    </span>
                  ) : (
                    "Aucune gare trouvée."
                  )}
                </CommandEmpty>
                {results.length > 0 && (
                  <CommandGroup heading="Gares">
                    {results.map((s) => (
                      <CommandItem
                        key={s.id}
                        value={s.id}
                        onSelect={() => go({ id: s.id, name: s.name, city: s.city })}
                      >
                        <MapPinIcon />
                        <span className="truncate">{s.name}</span>
                        {s.city && s.city !== s.name && (
                          <span className="truncate text-xs text-muted-foreground">
                            {s.city}
                            {s.zipCode ? ` · ${s.zipCode.slice(0, 2)}` : ""}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            ) : (
              <>
                <CommandEmpty>Tapez au moins 2 lettres.</CommandEmpty>
                {favorites.length > 0 && (
                  <CommandGroup heading="Favoris">
                    {favorites.map((s) => (
                      <CommandItem key={s.id} value={`fav-${s.id}`} onSelect={() => go(s)}>
                        <StarIcon />
                        <span className="truncate">{s.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {recent.length > 0 && (
                  <>
                    {favorites.length > 0 && <CommandSeparator />}
                    <CommandGroup heading="Récents">
                      {recent.map((s) => (
                        <CommandItem key={s.id} value={`recent-${s.id}`} onSelect={() => go(s)}>
                          <HistoryIcon />
                          <span className="truncate">{s.name}</span>
                        </CommandItem>
                      ))}
                      <CommandItem value="clear-recent" onSelect={clear}>
                        <TrashIcon />
                        <span className="text-muted-foreground">Effacer l&apos;historique</span>
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </SearchContext>
  )
}
