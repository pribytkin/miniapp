import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface FilterChange {
    type: 'location' | 'rating' | 'availability'
    value: string | number | boolean
}

interface ActiveFilters {
    location: string
    rating: number
    availability: boolean
}

interface District {
    id: number
    name: string
    description: string
}

interface QuickFiltersProps {
    onFilterChange: (filter: FilterChange) => void
    activeFilters: ActiveFilters
    className?: string
}

export function QuickFilters({
    onFilterChange,
    activeFilters,
    className = ""
}: QuickFiltersProps) {
    const [districts, setDistricts] = useState<District[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDistricts = async () => {
            try {
                const { data, error } = await api.districts.list()
                if (error) throw new Error(error)
                setDistricts(data)
            } catch (err) {
                console.error('Failed to load districts:', err)
                setDistricts([])
            } finally {
                setIsLoading(false)
            }
        }

        loadDistricts()
    }, [])

    const locations = ["Всі райони", ...districts.map(d => d.name)]

    const ratings = [
        { label: "4+ зірок", value: 4 },
        { label: "4.5+ зірок", value: 4.5 },
        { label: "Всі рейтинги", value: 0 }
    ] as const

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {/* Location Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isLoading}>
                        <MapPin className="mr-2 h-4 w-4" />
                        {activeFilters.location || "Район"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {locations.map((location) => (
                        <DropdownMenuItem
                            key={location}
                            onClick={() => onFilterChange({ type: 'location', value: location })}
                        >
                            {location}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Rating Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        {activeFilters.rating ? `${activeFilters.rating}+` : "Рейтинг"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {ratings.map((rating) => (
                        <DropdownMenuItem
                            key={rating.value}
                            onClick={() => onFilterChange({ type: 'rating', value: rating.value })}
                        >
                            {rating.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Availability Toggle */}
            <Button
                variant={activeFilters.availability ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange({
                    type: 'availability',
                    value: !activeFilters.availability
                })}
            >
                <Clock className="mr-2 h-4 w-4" />
                Зараз доступні
            </Button>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
                {activeFilters.location && activeFilters.location !== "Всі райони" && (
                    <Badge variant="secondary" className="gap-1">
                        {activeFilters.location}
                        <button
                            className="ml-1 hover:text-destructive"
                            onClick={() => onFilterChange({ type: 'location', value: '' })}
                        >
                            ×
                        </button>
                    </Badge>
                )}
                {activeFilters.rating > 0 && (
                    <Badge variant="secondary" className="gap-1">
                        {activeFilters.rating}+ зірок
                        <button
                            className="ml-1 hover:text-destructive"
                            onClick={() => onFilterChange({ type: 'rating', value: 0 })}
                        >
                            ×
                        </button>
                    </Badge>
                )}
                {activeFilters.availability && (
                    <Badge variant="secondary" className="gap-1">
                        Зараз доступні
                        <button
                            className="ml-1 hover:text-destructive"
                            onClick={() => onFilterChange({ type: 'availability', value: false })}
                        >
                            ×
                        </button>
                    </Badge>
                )}
            </div>
        </div>
    )
} 