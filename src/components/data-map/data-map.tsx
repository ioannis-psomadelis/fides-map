import { useEffect, useMemo, useRef } from 'react'
import { useArrows } from '@/hooks/use-arrows'
import { useFilteredData } from '@/hooks/use-filtered-data'
import { useHoverHighlight } from '@/hooks/use-hover-highlight'
import { useAppStore } from '@/stores/use-app-store'
import { LayoutMode } from '@/types'
import { resolveDependencyEdges } from '@/utils/data-transform'
import { DependencyArrows } from './dependency-arrows'
import { EmptyState } from './empty-state'
import { SystemGroup } from './system-group'

export const DataMap = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const layoutMode = useAppStore((s) => s.layoutMode)
  const { filteredSystems, groups, activeKeys, visibleCount } = useFilteredData()
  const { hoveredKey, highlightedKeys, setHoveredKey } = useHoverHighlight()

  useEffect(() => {
    setHoveredKey(null)
  }, [layoutMode, setHoveredKey])

  const edges = useMemo(() => resolveDependencyEdges(filteredSystems), [filteredSystems])
  const { arrows } = useArrows(containerRef, edges)

  return (
    <div ref={containerRef} className="relative min-h-full p-6 canvas-bg overflow-x-auto canvas-scrollbar">
      <div className="relative flex gap-9 items-start min-w-min">
        {groups.map((group) => (
          <SystemGroup
            key={group.key}
            group={group}
            activeKeys={activeKeys}
            hoveredKey={hoveredKey}
            highlightedKeys={highlightedKeys}
            onHover={setHoveredKey}
            layoutMode={layoutMode}
          />
        ))}
      </div>
      {/* Arrows hidden in ByDataUse — systems appear in multiple columns, edges would be chaotic */}
      {layoutMode === LayoutMode.BySystemType && (
        <DependencyArrows
          arrows={arrows}
          hoveredKey={hoveredKey}
          highlightedKeys={highlightedKeys}
          activeKeys={activeKeys}
        />
      )}
      {visibleCount === 0 && <EmptyState />}
    </div>
  )
}
