"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"

interface Station {
  id: string
  name: string
  label: string
}

export function Combobox() {
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [stations, setStations] = React.useState<Station[]>([])
  const [loading, setLoading] = React.useState(false)

  const searchStations = React.useCallback(async (search: string) => {
    if (!search && search.length < 3) {
      setStations([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.sncf.com/v1/coverage/sncf/pt_objects?q=${encodeURIComponent(search)}`,
        {
          headers: {
            'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`
          }
        }
      )
      
      const data = await response.json()
      
      const filteredStations = (data.pt_objects || [])  // Ajout du fallback à un tableau vide
      .filter((obj: any) => obj.embedded_type === 'stop_area')
      .map((obj: any) => ({
        id: obj.id,
        name: obj.stop_area.name,
        label: obj.stop_area.name
      }))

      setStations(filteredStations)
    } catch (error) {
      console.error('Erreur lors de la recherche des gares:', error)
      setStations([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            || "Rechercher une gare..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Saisissez le nom d'une gare..." 
            onValueChange={(search) => searchStations(search)}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Recherche en cours..." : "Aucune gare trouvée."}
            </CommandEmpty>
            <CommandGroup>
              {stations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    router.push(`/station/${station.id}`)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === station.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {station.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}