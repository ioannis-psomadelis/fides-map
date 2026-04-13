import { X } from 'lucide-react'
import { DATA_USE_LABELS } from '@/data/sample-data'
import { useAppStore } from '@/stores/use-app-store'

export const ActiveChips = () => {
  const activeDataUse = useAppStore((s) => s.activeDataUse)
  const activeCategories = useAppStore((s) => s.activeCategories)
  const setDataUse = useAppStore((s) => s.setDataUse)
  const toggleCategory = useAppStore((s) => s.toggleCategory)
  const clearFilters = useAppStore((s) => s.clearFilters)

  const hasActiveFilters = activeDataUse !== null || activeCategories.length > 0
  if (!hasActiveFilters) return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {activeDataUse && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-text-primary">
            {DATA_USE_LABELS.get(activeDataUse)}
            <button
              type="button"
              onClick={() => setDataUse(null)}
              className="rounded-full p-0.5 hover:bg-accent/20 transition-colors cursor-pointer"
              aria-label={`Remove ${DATA_USE_LABELS.get(activeDataUse)} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {activeCategories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-text-primary"
          >
            {cat}
            <button
              type="button"
              onClick={() => toggleCategory(cat)}
              className="rounded-full p-0.5 hover:bg-accent/20 transition-colors cursor-pointer"
              aria-label={`Remove ${cat} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={clearFilters}
        className="text-xs text-text-muted hover:text-text-primary transition-colors underline cursor-pointer"
      >
        Clear all
      </button>
    </div>
  )
}
