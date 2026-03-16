import * as React from "react"
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Location {
    name: string
    city: string
    country: string
    iata?: string
    code?: string
}

interface LocationSelectProps {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    locations: Location[]
}

export function LocationSelect({ value, onChange, placeholder = "Select...", locations }: LocationSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Filter locations based on search query
    const filteredLocations = React.useMemo(() => {
        if (!searchQuery) return locations.slice(0, 10) // Show top 10 initially
        
        const query = searchQuery.toLowerCase()
        return locations.filter(loc => 
            loc.name.toLowerCase().includes(query) ||
            (loc.iata && loc.iata.toLowerCase().includes(query)) ||
            (loc.code && loc.code.toLowerCase().includes(query)) ||
            loc.city.toLowerCase().includes(query) ||
            loc.country.toLowerCase().includes(query)
        ).slice(0, 50) // Limit to 50 results for performance
    }, [searchQuery, locations])

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

    const selectedLocation = locations.find(l => 
        (l.iata && l.iata === value) || 
        (l.code && l.code === value) || 
        l.name === value
    )

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
                    {selectedLocation 
                        ? `${selectedLocation.name}${selectedLocation.iata ? ` (${selectedLocation.iata})` : selectedLocation.code ? ` (${selectedLocation.code})` : ''}` 
                        : placeholder}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-0 shadow-md animate-in fade-in zoom-in-95 bg-white">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            placeholder="Search name, city or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery) {
                                    onChange(searchQuery)
                                    setOpen(false)
                                    setSearchQuery("")
                                }
                            }}
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 text-black"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1 text-black">
                        {searchQuery && !locations.some(l => l.name.toLowerCase() === searchQuery.toLowerCase() || (l.iata && l.iata.toLowerCase() === searchQuery.toLowerCase()) || (l.code && l.code.toLowerCase() === searchQuery.toLowerCase())) && (
                             <button
                                 className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-blue-50 transition-colors border-b mb-1 text-blue-600"
                                 onClick={() => {
                                     onChange(searchQuery)
                                     setOpen(false)
                                     setSearchQuery("")
                                 }}
                                 type="button"
                             >
                                 <div className="flex items-center">
                                     <Plus className="mr-2 h-3 w-3" />
                                     <span className="font-medium">Use custom: "{searchQuery}"</span>
                                 </div>
                             </button>
                        )}
                        {filteredLocations.length === 0 && !searchQuery ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">No matches found.</div>
                        ) : (
                            filteredLocations.map((loc, idx) => {
                                const key = `${loc.iata || loc.code || loc.name}-${idx}`;
                                return (
                                    <button
                                        key={key}
                                        className={cn(
                                            "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 transition-colors",
                                            (value === loc.iata || value === loc.code || value === loc.name) && "bg-slate-50 font-medium"
                                        )}
                                        onClick={() => {
                                            onChange(loc.name) 
                                            setOpen(false)
                                            setSearchQuery("")
                                        }}
                                        type="button"
                                    >
                                        <div className="flex flex-col items-start">
                                            <div className="flex items-center">
                                                <span className="font-bold mr-2">{loc.iata || loc.code}</span>
                                                <span>{loc.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{loc.city}, {loc.country}</span>
                                        </div>
                                        {(value === loc.iata || value === loc.code || value === loc.name) && (
                                            <Check className="ml-auto h-4 w-4 opacity-100 text-blue-600" />
                                        )}
                                    </button>
                                )
                            })
                        )}
                        {searchQuery && filteredLocations.length > 0 && locations.length > filteredLocations.length && (
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
