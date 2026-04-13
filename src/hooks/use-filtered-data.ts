import { useMemo } from 'react'
import { SYSTEMS } from '../data/sample-data'
import { useAppStore } from '../stores/use-app-store'
import { filterSystems, groupSystems } from '../utils/data-transform'

export const useFilteredData = () => {
  const activeDataUse = useAppStore((s) => s.activeDataUse)
  const activeCategories = useAppStore((s) => s.activeCategories)
  const layoutMode = useAppStore((s) => s.layoutMode)

  const filteredSystems = useMemo(
    () => filterSystems(SYSTEMS, activeDataUse, activeCategories),
    [activeDataUse, activeCategories],
  )

  const activeKeys = useMemo(() => new Set(filteredSystems.map((s) => s.fides_key)), [filteredSystems])

  // Groups ALL systems (not filtered) so column layout stays stable — cards dim in-place
  const groups = useMemo(() => groupSystems(SYSTEMS, layoutMode), [layoutMode])

  return { filteredSystems, activeKeys, groups, visibleCount: filteredSystems.length }
}
