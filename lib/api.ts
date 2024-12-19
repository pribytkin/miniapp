import { Category, Specialist, Review, Service, Location } from '@/types'

const API_BASE_URL = '/api/v1'

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

type ApiResponse<T> = {
    data: T
    error?: string
}

type SpecialistFilters = {
    category_id?: number
    location_type?: string
    availability?: string
    search?: string
    is_verified?: boolean
}

async function fetchWithError<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...DEFAULT_HEADERS,
                ...options.headers
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data }
    } catch (error) {
        if (Array.isArray(error)) {
            return { data: [] as unknown as T, error: error[0]?.message || 'Unknown error' }
        }
        return {
            data: (Array.isArray(error) ? [] : {}) as T,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export const api = {
    specialists: {
        list: async (filters: SpecialistFilters = {}): Promise<ApiResponse<Specialist[]>> => {
            const queryParams = new URLSearchParams()
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    queryParams.append(key, value.toString())
                }
            })

            return fetchWithError<Specialist[]>(`${API_BASE_URL}/specialists/?${queryParams}`)
        },

        getById: async (id: number): Promise<ApiResponse<Specialist>> => {
            return fetchWithError<Specialist>(`${API_BASE_URL}/specialists/${id}`)
        },

        updateStatus: async (id: number, status: string): Promise<ApiResponse<Specialist>> => {
            return fetchWithError<Specialist>(`${API_BASE_URL}/specialists/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            })
        }
    },

    categories: {
        list: async (): Promise<ApiResponse<Category[]>> => {
            return fetchWithError<Category[]>(`${API_BASE_URL}/categories/`)
        }
    },

    districts: {
        list: async (): Promise<ApiResponse<{ id: number; name: string; description: string }[]>> => {
            return fetchWithError(`${API_BASE_URL}/districts/`)
        }
    },

    reviews: {
        listBySpecialist: async (specialistId: number): Promise<ApiResponse<Review[]>> => {
            return fetchWithError<Review[]>(`${API_BASE_URL}/specialists/${specialistId}/reviews`)
        },

        create: async (specialistId: number, review: { user_id: string; rating: number; comment: string }): Promise<ApiResponse<Review>> => {
            return fetchWithError<Review>(`${API_BASE_URL}/specialists/${specialistId}/reviews`, {
                method: 'POST',
                body: JSON.stringify(review)
            })
        }
    },

    services: {
        listBySpecialist: async (specialistId: number): Promise<ApiResponse<Service[]>> => {
            return fetchWithError<Service[]>(`${API_BASE_URL}/specialists/${specialistId}/services`)
        }
    },

    locations: {
        listBySpecialist: async (specialistId: number): Promise<ApiResponse<Location[]>> => {
            return fetchWithError<Location[]>(`${API_BASE_URL}/specialists/${specialistId}/locations`)
        }
    }
} 