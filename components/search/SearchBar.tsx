import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
    className?: string
}

export function SearchBar({
    onSearch,
    placeholder = "Пошук послуги або спеціаліста...",
    className = ""
}: SearchBarProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const query = formData.get('search') as string
        onSearch(query)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`relative flex w-full items-center gap-2 ${className}`}
        >
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    name="search"
                    placeholder={placeholder}
                    className="pl-9 pr-4 h-10 md:h-11"
                />
            </div>
            <Button type="submit" size="sm" className="h-10 md:h-11 whitespace-nowrap">
                Пошук
            </Button>
        </form>
    )
} 