"use client"

import { useEffect } from "react"
import { Share2Icon, StarIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { SavedStation } from "@/hooks/use-stations-store"
import { useFavorites, useRecentStations } from "@/hooks/use-stations-store"
import { cn } from "@/lib/utils"

export function StationActions({ station }: { station: SavedStation }) {
  const { isFavorite, toggle } = useFavorites()
  const { push } = useRecentStations()
  const favorite = isFavorite(station.id)

  useEffect(() => {
    push(station)
  }, [push, station])

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: `${station.name} · Railr`, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url)
    toast.success("Lien copié")
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-pressed={favorite}
              aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              onClick={() => {
                const added = toggle(station)
                toast.success(added ? "Ajoutée aux favoris" : "Retirée des favoris", {
                  description: station.name,
                })
              }}
            />
          }
        >
          <StarIcon className={cn(favorite && "fill-warning text-warning")} />
        </TooltipTrigger>
        <TooltipContent>{favorite ? "Retirer des favoris" : "Ajouter aux favoris"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline" size="icon" aria-label="Partager" onClick={share} />}
        >
          <Share2Icon />
        </TooltipTrigger>
        <TooltipContent>Partager</TooltipContent>
      </Tooltip>
    </div>
  )
}
