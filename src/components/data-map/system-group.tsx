import type { LayoutMode, SystemGroup as SystemGroupType } from '@/types'
import { SystemCard } from './system-card'

interface SystemGroupProps {
  readonly group: SystemGroupType
  readonly activeKeys: Set<string>
  readonly hoveredKey: string | null
  readonly highlightedKeys: Set<string>
  readonly onHover: (key: string | null) => void
  readonly layoutMode: LayoutMode
}

export const SystemGroup = ({
  group,
  activeKeys,
  hoveredKey,
  highlightedKeys,
  onHover,
  layoutMode,
}: SystemGroupProps) => {
  const activeCount = group.systems.filter((s) => activeKeys.has(s.fides_key)).length

  return (
    <section className="flex flex-col gap-3 w-64 min-w-[16rem] shrink-0">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-text-primary whitespace-nowrap">{group.label}</h2>
        <span className="text-xs text-text-muted">({activeCount})</span>
      </div>
      <div className="flex flex-col gap-4">
        {group.systems.map((system) => (
          <SystemCard
            key={system.fides_key}
            system={system}
            isFilteredOut={!activeKeys.has(system.fides_key)}
            isHovered={hoveredKey === system.fides_key}
            isHighlighted={highlightedKeys.has(system.fides_key)}
            someCardHovered={hoveredKey !== null}
            onHover={onHover}
            layoutMode={layoutMode}
          />
        ))}
      </div>
    </section>
  )
}
