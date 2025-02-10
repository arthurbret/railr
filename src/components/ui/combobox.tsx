"use client"

import * as React from "react"
import {Check} from "lucide-react"
import {cn} from "@/lib/utils"
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
import {useRouter} from "next/navigation"

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
    const inputRef = React.useRef<HTMLInputElement>(null)

    const searchStations = React.useCallback(async (search: string) => {
        if (!search && search.length < 3) {
            setOpen(false)
            setStations([])
            return
        }

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
                .filter((obj: { embedded_type: string }) => obj.embedded_type === 'stop_area')
                .map((obj: { id: string; stop_area: { name: string } }) => ({
                    id: obj.id,
                    name: obj.stop_area.name,
                    label: obj.stop_area.name
                }))

            setStations(filteredStations)
            setOpen(true)
        } catch (error) {
            console.error('Erreur lors de la recherche des gares:', error)
            setStations([])
            setOpen(false)
        }
    }, [])

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key.toLowerCase() === "k") {
                event.preventDefault()
                setTimeout(() => inputRef.current?.focus(), 100)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <Popover open={true}>
            <PopoverTrigger asChild>
                <div></div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    {open && (
                        <CommandList>
                            <CommandEmpty>
                                Aucune gare trouvée.
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
                    )}

                    <CommandInput
                        ref={inputRef}
                        placeholder="Saisissez le nom d'une gare..."
                        onValueChange={(search) => searchStations(search)}
                    />
                </Command>
            </PopoverContent>
        </Popover>
    )
}