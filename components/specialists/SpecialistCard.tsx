import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star, Clock, CheckCircle2 } from "lucide-react"
import { Specialist, AvailabilityStatus } from "@/types"
import { formatPrice } from "@/lib/utils"

interface SpecialistCardProps {
    specialist: Specialist
    onContact: (specialist: Specialist) => void
    onViewProfile: (specialist: Specialist) => void
    compact?: boolean
    className?: string
}

const availabilityColors = {
    [AvailabilityStatus.AVAILABLE]: "text-green-500",
    [AvailabilityStatus.BUSY]: "text-yellow-500",
    [AvailabilityStatus.OFFLINE]: "text-gray-500",
}

export function SpecialistCard({
    specialist,
    onContact,
    onViewProfile,
    compact = false,
    className = ""
}: SpecialistCardProps) {
    const primaryLocation = specialist.locations?.find(loc => loc.is_primary)
    const minPrice = specialist.services?.length
        ? Math.min(...specialist.services.map(s => s.price_min || 0))
        : 0

    return (
        <Card className={`overflow-hidden ${className}`}>
            <CardContent className="p-3">
                <div className="flex gap-3">
                    {/* Avatar and Basic Info */}
                    <Avatar className="h-14 w-14 border">
                        <AvatarImage src={specialist.photo_url} alt={specialist.name} />
                        <AvatarFallback>{specialist.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-medium truncate">{specialist.name}</h3>
                                    {specialist.is_verified && (
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                                    )}
                                </div>
                                {/* Rating */}
                                <div className="flex items-center gap-1.5 text-sm">
                                    <div className="flex items-center">
                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="ml-0.5 font-medium">{specialist.rating}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        ({specialist.total_reviews} відгуків)
                                    </span>
                                    {minPrice > 0 && (
                                        <>
                                            <span className="text-muted-foreground">•</span>
                                            <span>від {formatPrice(minPrice)}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${availabilityColors[specialist.availability_status]}`}>
                                <Clock className="h-3.5 w-3.5" />
                                <span className="text-xs whitespace-nowrap">
                                    {specialist.availability_status === "available" ? "Доступний" :
                                        specialist.availability_status === "busy" ? "Зайнятий" : "Не в мережі"}
                                </span>
                            </div>
                        </div>

                        {/* Location */}
                        {primaryLocation && (
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground truncate">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{primaryLocation.address}</span>
                            </div>
                        )}

                        {/* Categories */}
                        {!compact && specialist.categories && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {specialist.categories.map((category) => (
                                    <Badge key={category.id} variant="secondary" className="text-xs">
                                        {category.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio - Only shown in non-compact mode */}
                {!compact && specialist.bio && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{specialist.bio}</p>
                )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 p-3 pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => onViewProfile(specialist)}
                >
                    Детальніше
                </Button>
                <Button
                    size="sm"
                    className="h-8"
                    onClick={() => onContact(specialist)}
                >
                    Зв'язатися
                </Button>
            </CardFooter>
        </Card>
    )
} 