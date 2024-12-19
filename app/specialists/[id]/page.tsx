'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Star, Clock, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Specialist, Service, Review } from '@/types'
import { api } from '@/lib/api'
import { formatPrice, formatDuration } from '@/lib/utils'

export default function SpecialistProfile() {
    const params = useParams()
    const specialistId = Number(params.id)

    const [specialist, setSpecialist] = useState<Specialist | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const [specialistRes, servicesRes, reviewsRes] = await Promise.all([
                    api.specialists.getById(specialistId),
                    api.services.listBySpecialist(specialistId),
                    api.reviews.listBySpecialist(specialistId)
                ])

                if (specialistRes.error) throw new Error(specialistRes.error)
                if (servicesRes.error) throw new Error(servicesRes.error)
                if (reviewsRes.error) throw new Error(reviewsRes.error)

                setSpecialist(specialistRes.data)
                setServices(servicesRes.data)
                setReviews(reviewsRes.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load specialist data')
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [specialistId])

    const handleBack = () => {
        window.history.back()
    }

    const handleContact = () => {
        if (specialist?.telegram_username && window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(`https://t.me/${specialist.telegram_username}`)
        }
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[100dvh] p-4">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-destructive mb-2">Помилка завантаження</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={handleBack} className="mt-4">
                        Повернутися назад
                    </Button>
                </div>
            </div>
        )
    }

    if (isLoading || !specialist) {
        return (
            <div className="space-y-4 p-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        )
    }

    const primaryLocation = specialist.locations?.find(loc => loc.is_primary)

    return (
        <main className="min-h-[100dvh] pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="px-4 py-3 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Профіль спеціаліста</h1>
                </div>
            </div>

            {/* Profile Info */}
            <div className="p-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <Avatar className="h-20 w-20 border">
                                <AvatarImage src={specialist.photo_url} alt={specialist.name} />
                                <AvatarFallback>{specialist.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h2 className="text-xl font-semibold truncate">{specialist.name}</h2>
                                            {specialist.is_verified && (
                                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="ml-0.5 font-medium">{specialist.rating}</span>
                                            </div>
                                            <span className="text-muted-foreground">
                                                ({specialist.total_reviews} відгуків)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-xs whitespace-nowrap">
                                            {specialist.availability_status === "available" ? "Доступний" :
                                                specialist.availability_status === "busy" ? "Зайнятий" : "Не в мережі"}
                                        </span>
                                    </div>
                                </div>

                                {primaryLocation && (
                                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">{primaryLocation.address}</span>
                                    </div>
                                )}

                                {specialist.categories && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {specialist.categories.map((category) => (
                                            <Badge key={category.id} variant="secondary" className="text-xs">
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {specialist.bio && (
                            <p className="mt-4 text-sm text-muted-foreground">{specialist.bio}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Services */}
                {services.length > 0 && (
                    <section className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Послуги</h3>
                        <div className="space-y-3">
                            {services.map((service) => (
                                <Card key={service.id}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h4 className="font-medium">{service.name}</h4>
                                                {service.description && (
                                                    <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {service.price_min === service.price_max
                                                        ? formatPrice(service.price_min || 0)
                                                        : `від ${formatPrice(service.price_min || 0)}`}
                                                </div>
                                                {service.duration && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatDuration(service.duration)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews */}
                {reviews.length > 0 && (
                    <section className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Відгуки</h3>
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="ml-0.5 font-medium">{review.rating}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">•</span>
                                            <time className="text-sm text-muted-foreground">
                                                {new Date(review.created_at).toLocaleDateString('uk-UA')}
                                            </time>
                                        </div>
                                        {review.comment && <p className="text-sm">{review.comment}</p>}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Contact Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                <Button className="w-full" size="lg" onClick={handleContact}>
                    Зв'язатися
                </Button>
            </div>
        </main>
    )
} 