import { useRef } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/use-app-store'
import type { System } from '@/types'
import { LayoutMode } from '@/types'
import { getUniqueLeafCategories } from '@/utils/data-transform'

interface SystemCardProps {
  readonly system: System
  readonly isFilteredOut: boolean
  readonly isHovered: boolean
  readonly isHighlighted: boolean
  readonly someCardHovered: boolean
  readonly onHover: (key: string | null) => void
  readonly layoutMode: LayoutMode
}

export const SystemCard = ({
  system,
  isFilteredOut,
  isHovered,
  isHighlighted,
  someCardHovered,
  onHover,
  layoutMode,
}: SystemCardProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const categories = getUniqueLeafCategories(system)
  const primaryDeclaration = system.privacy_declarations[0]
  const toggleCategory = useAppStore((s) => s.toggleCategory)
  const activeCategories = useAppStore((s) => s.activeCategories)
  const activeDataUse = useAppStore((s) => s.activeDataUse)
  const setDataUse = useAppStore((s) => s.setDataUse)

  return (
    <article
      data-fides-key={system.fides_key}
      // viewTransitionName must be unique, in ByDataUse a system can appear in multiple groups
      style={{
        viewTransitionName: layoutMode === LayoutMode.BySystemType ? system.fides_key : undefined,
      }}
      className={cn(
        'relative z-2 rounded-lg border border-surface-border bg-surface-raised p-3 shadow-sm cursor-pointer',
        'transition-[opacity,filter,border-color,box-shadow] duration-300 ease-out',
        isFilteredOut && 'opacity-30 saturate-50 pointer-events-none select-none',
        !isFilteredOut && isHovered && 'opacity-100 ring-2 ring-text-primary shadow-lg',
        !isFilteredOut && !isHovered && isHighlighted && 'opacity-100 ring-1 ring-text-muted shadow-md',
        !isFilteredOut && !isHovered && !isHighlighted && someCardHovered && 'opacity-15 shadow-none',
        !isFilteredOut && !isHovered && !isHighlighted && !someCardHovered && 'opacity-100',
      )}
      onClick={() => { if (detailsRef.current) detailsRef.current.open = !detailsRef.current.open }}
      onMouseEnter={() => onHover(system.fides_key)}
      onMouseLeave={() => onHover(null)}
    >
      <details ref={detailsRef} className="group">
        <summary className="flex items-start justify-between gap-2 pointer-events-none list-none [&::-webkit-details-marker]:hidden">
          <h3 className="text-xs font-medium text-text-primary leading-snug">{system.name}</h3>
          <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <p className="pt-1.5 text-[11px] leading-relaxed text-text-secondary">{system.description}</p>
      </details>

      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              title={activeCategories.includes(cat) ? `Remove ${cat} filter` : `Filter by ${cat}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleCategory(cat)
              }}
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide cursor-pointer',
                activeCategories.includes(cat)
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-surface-base text-text-secondary hover:bg-accent/10',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {layoutMode === LayoutMode.ByDataUse ? (
        <div className="mt-2 border-t border-surface-border pt-1.5 flex items-baseline gap-2">
          <span className="text-[10px] text-text-muted tracking-wide shrink-0">Type</span>
          <span className="text-[10px] text-text-secondary tracking-wide">{system.system_type}</span>
        </div>
      ) : (
        primaryDeclaration && (
          <div className="mt-2 border-t border-surface-border pt-1.5 flex items-baseline gap-2">
            <span className="text-[10px] text-text-muted tracking-wide shrink-0">Data Use</span>
            <button
              type="button"
              title={
                activeDataUse === primaryDeclaration.data_use
                  ? `Remove ${primaryDeclaration.name} filter`
                  : `Filter by ${primaryDeclaration.name}`
              }
              onClick={(e) => {
                e.stopPropagation()
                setDataUse(activeDataUse === primaryDeclaration.data_use ? null : primaryDeclaration.data_use)
              }}
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] tracking-wide cursor-pointer',
                activeDataUse === primaryDeclaration.data_use
                  ? 'bg-accent text-accent-foreground'
                  : 'text-text-secondary hover:bg-accent/10',
              )}
            >
              {primaryDeclaration.name}
            </button>
          </div>
        )
      )}
    </article>
  )
}
