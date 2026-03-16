import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIRPORTS, Airport } from "../lib/airports"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AirportSelectProps {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
}

export function AirportSelect({ value, onChange, placeholder = "Select airport..." }: AirportSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Filter airports based on search query
    const filteredAirports = React.useMemo(() => {
        if (!searchQuery) return AIRPORTS.slice(0, 10) // Show top 10 initially
        
        const query = searchQuery.toLowerCase()
        return AIRPORTS.filter(airport => 
            airport.name.toLowerCase().includes(query) ||
            airport.iata.toLowerCase().includes(query) ||
            airport.city.toLowerCase().includes(query) ||
            airport.country.toLowerCase().includes(query)
        ).slice(0, 50) // Limit to 50 results for performance
    }, [searchQuery])

    // Handle clicking outside to close
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectedAirport = AIRPORTS.find(a => a.iata === value || a.name === value)

    return (
        <div className="relative w-full" ref={containerRef}>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between font-normal"
                onClick={() => setOpen(!open)}
                type="button"
            >
                <span className="truncate">
                    {selectedAirport ? `${selectedAirport.name} (${selectedAirport.iata})` : placeholder}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-0 shadow-md animate-in fade-in zoom-in-95 bg-white">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            placeholder="Search airport, city or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {filteredAirports.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">No airport found.</div>
                        ) : (
                            filteredAirports.map((airport) => (
                                <button
                                    key={airport.iata}
                                    className={cn(
                                        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 transition-colors",
                                        (value === airport.iata || value === airport.name) && "bg-slate-50 font-medium"
                                    )}
                                    onClick={() => {
                                        onChange(airport.name) // We send the name (or IATA) back. User asked for "airport name shown".
                                        setOpen(false)
                                        setSearchQuery("")
                                    }}
                                    type="button"
                                >
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center">
                                            <span className="font-bold mr-2">{airport.iata}</span>
                                            <span>{airport.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{airport.city}, {airport.country}</span>
                                    </div>
                                    {(value === airport.iata || value === airport.name) && (
                                        <Check className="ml-auto h-4 w-4 opacity-100 text-blue-600" />
                                    )}
                                </button>
                            ))
                        )}
                        {searchQuery && filteredAirports.length > 0 && AIRPORTS.length > filteredAirports.length && (
                            <div className="px-2 py-1 text-[10px] text-muted-foreground border-t text-center uppercase tracking-tighter bg-slate-50">
                                showing first 50 results
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
