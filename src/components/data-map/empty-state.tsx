import { SearchX } from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'

export const EmptyState = () => {
  const clearFilters = useAppStore((s) => s.clearFilters)

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <SearchX className="h-12 w-12 text-text-muted" />
        <p className="text-lg font-medium text-text-primary">No systems match your filters</p>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}
