export enum LocationType {
    ON_SITE = "on_site",
    REMOTE = "remote",
    BOTH = "both"
}

export enum AvailabilityStatus {
    AVAILABLE = "available",
    BUSY = "busy",
    OFFLINE = "offline"
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    description?: string;
}

export interface Location {
    id: number;
    specialist_id: number;
    address: string;
    latitude: number;
    longitude: number;
    service_area?: string[];
    is_primary: boolean;
}

export interface Review {
    id: number;
    specialist_id: number;
    user_id: string;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface Service {
    id: number;
    specialist_id: number;
    name: string;
    description?: string;
    price_min?: number;
    price_max?: number;
    duration?: number;
}

export interface Specialist {
    id: number;
    telegram_id: string;
    name: string;
    photo_url?: string;
    bio?: string;
    phone?: string;
    telegram_username?: string;
    location_type: LocationType;
    availability_status: AvailabilityStatus;
    rating: number;
    total_reviews: number;
    is_verified: boolean;
    last_active: string;
    created_at: string;
    updated_at: string;
    categories?: Category[];
    locations?: Location[];
    services?: Service[];
    reviews?: Review[];
} 