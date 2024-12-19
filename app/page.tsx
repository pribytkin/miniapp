'use client'

import { useEffect, useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { CategoryGrid } from '@/components/categories/CategoryGrid'
import { QuickFilters } from '@/components/filters/QuickFilters'
import { SpecialistCard } from '@/components/specialists/SpecialistCard'
import { Category, Specialist } from '@/types'
import { initTelegramApp } from '@/lib/utils'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    rating: 0,
    availability: false
  } as const)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramApp()

    // Load initial data
    loadData()
  }, [])

  useEffect(() => {
    // Reload specialists when filters change
    if (!isInitialLoading) {
      loadSpecialists()
    }
  }, [activeFilters, searchQuery, selectedCategory, isInitialLoading])

  const loadData = async () => {
    setIsInitialLoading(true)
    setError(null)
    try {
      const [categoriesResponse, specialistsResponse] = await Promise.all([
        api.categories.list(),
        api.specialists.list()
      ])

      if (categoriesResponse.error) throw new Error(categoriesResponse.error)
      if (specialistsResponse.error) throw new Error(specialistsResponse.error)

      setCategories(categoriesResponse.data)
      setSpecialists(specialistsResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsInitialLoading(false)
    }
  }

  const loadSpecialists = async () => {
    setIsFiltering(true)
    setError(null)
    try {
      const { data, error } = await api.specialists.list({
        search: searchQuery,
        availability: activeFilters.availability ? 'available' : undefined,
        category_id: selectedCategory || undefined,
        location_type: undefined // Will be added when location type filter is implemented
      })

      if (error) throw new Error(error)
      setSpecialists(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load specialists')
    } finally {
      setIsFiltering(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: Category) => {
    // Toggle category selection
    setSelectedCategory(prev => prev === category.id ? null : category.id)
  }

  const handleFilterChange = (filter: { type: 'location' | 'rating' | 'availability'; value: string | number | boolean }) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter.type]: filter.value
    }))
  }

  const handleContactSpecialist = (specialist: Specialist) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(`https://t.me/${specialist.telegram_username}`)
    }
  }

  const handleViewProfile = (specialist: Specialist) => {
    // Navigate to specialist profile
    // Will be implemented when profile page is ready
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">Помилка завантаження</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={isInitialLoading ? loadData : loadSpecialists}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    )
  }

  const isLoading = isInitialLoading || isFiltering

  return (
    <main className="flex flex-col min-h-[100dvh]">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-3 border-b">
          <h1 className="text-xl font-semibold mb-3">Знайти спеціаліста</h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Введіть послугу або спеціаліста..."
            className="w-full"
          />
        </div>
        <div className="px-4 py-2 overflow-x-auto scrollbar-none">
          <QuickFilters
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 space-y-8">
        {/* Categories Section */}
        <section>
          <h2 className="text-lg font-medium mb-4">
            Категорії
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-2 text-sm text-primary hover:text-primary/80"
              >
                Скинути
              </button>
            )}
          </h2>
          {isInitialLoading ? (
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : (
            <CategoryGrid
              categories={categories}
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={selectedCategory}
            />
          )}
        </section>

        {/* Specialists Section */}
        <section>
          <h2 className="text-lg font-medium mb-4">
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name || 'Спеціалісти'}`
              : 'Популярні спеціалісти'
            }
          </h2>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))
            ) : specialists.length > 0 ? (
              specialists.map((specialist) => (
                <SpecialistCard
                  key={specialist.id}
                  specialist={specialist}
                  onContact={handleContactSpecialist}
                  onViewProfile={handleViewProfile}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Спеціалістів не знайдено
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
