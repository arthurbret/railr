"use client"

import { useState } from "react"
import Link from "next/link"
import { LocateFixedIcon, MapPinIcon, NavigationIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { SectionTitle } from "@/components/home/favorite-stations"
import { stationHref } from "@/components/station-search"
import { useNearbyStations } from "@/lib/api"
import { formatDistance } from "@/lib/format"

type GeoState = "idle" | "locating" | "denied" | "ready"

export function NearbyStations() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [geo, setGeo] = useState<GeoState>("idle")
  const { data, isLoading, error } = useNearbyStations(coords)

  function locate() {
    if (!navigator.geolocation) {
      setGeo("denied")
      return
    }
    setGeo("locating")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setGeo("ready")
      },
      () => setGeo("denied"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
    )
  }

  const stations = data?.stations ?? []

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle
        icon={NavigationIcon}
        title="Autour de moi"
        action={
          geo === "ready" && (
            <Button variant="ghost" size="sm" onClick={locate}>
              <LocateFixedIcon data-icon="inline-start" />
              Actualiser
            </Button>
          )
        }
      />
      <Card className="py-2">
        {geo !== "ready" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <p className="max-w-xs text-sm text-muted-foreground">
              {geo === "denied"
                ? "Localisation refusée. Autorisez-la dans votre navigateur pour voir les gares proches."
                : "Trouvez les gares les plus proches de vous en un geste."}
            </p>
            <Button onClick={locate} disabled={geo === "locating"}>
              {geo === "locating" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <LocateFixedIcon data-icon="inline-start" />
              )}
              Me localiser
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3 px-6 py-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error || stations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            Aucune gare SNCF trouvée à moins de 15 km.
          </p>
        ) : (
          <ItemGroup className="px-2">
            {stations.map((s) => (
              <Item key={s.id} size="sm" render={<Link href={stationHref(s.id)} />}>
                <ItemMedia variant="icon">
                  <MapPinIcon />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full truncate">{s.name}</ItemTitle>
                  {s.city && <ItemDescription>{s.city}</ItemDescription>}
                </ItemContent>
                {s.distance !== undefined && (
                  <ItemActions className="font-mono text-xs text-muted-foreground tabular">
                    {formatDistance(s.distance)}
                  </ItemActions>
                )}
              </Item>
            ))}
          </ItemGroup>
        )}
      </Card>
    </section>
  )
}
