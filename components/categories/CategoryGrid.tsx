import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import * as icons from "lucide-react"
import { Category } from "@/types"
import { cn } from "@/lib/utils"

interface CategoryGridProps {
    categories: Category[]
    onCategorySelect: (category: Category) => void
    selectedCategoryId?: number | null
    className?: string
}

interface CategoryCardProps {
    category: Category
    onClick: (category: Category) => void
    isSelected?: boolean
}

function CategoryCard({ category, onClick, isSelected }: CategoryCardProps) {
    // Dynamically get icon from lucide-react
    const IconComponent = icons[category.icon as keyof typeof icons] as LucideIcon

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:scale-105 active:scale-95 touch-manipulation",
                isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onClick(category)}
        >
            <CardContent className="flex flex-col items-center justify-center p-3 text-center">
                {IconComponent && (
                    <IconComponent className={cn(
                        "mb-2 h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                )}
                <h3 className={cn(
                    "text-xs font-medium line-clamp-2",
                    isSelected && "text-primary"
                )}>
                    {category.name}
                </h3>
            </CardContent>
        </Card>
    )
}

export function CategoryGrid({
    categories,
    onCategorySelect,
    selectedCategoryId,
    className = ""
}: CategoryGridProps) {
    return (
        <div className={`grid grid-cols-4 gap-2 md:gap-4 ${className}`}>
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={onCategorySelect}
                    isSelected={selectedCategoryId === category.id}
                />
            ))}
        </div>
    )
} 