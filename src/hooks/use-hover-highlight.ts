import { useMemo, useState } from 'react'
import { SYSTEM_BY_KEY, SYSTEMS } from '../data/sample-data'

export const useHoverHighlight = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const highlightedKeys = useMemo(() => {
    if (!hoveredKey) return new Set<string>()
    const highlighted = new Set<string>()
    const hovered = SYSTEM_BY_KEY.get(hoveredKey)
    if (!hovered) return highlighted

    hovered.system_dependencies.forEach((dep) => highlighted.add(dep))

    SYSTEMS.forEach((system) => {
      if (system.system_dependencies.includes(hoveredKey)) {
        highlighted.add(system.fides_key)
      }
    })

    return highlighted
  }, [hoveredKey])

  return { hoveredKey, highlightedKeys, setHoveredKey }
}
