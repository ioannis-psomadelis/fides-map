import { DATA_USE_LABELS } from '../data/sample-data'
import type { System, SystemGroup } from '../types'
import { LayoutMode } from '../types'
import { toDisplayLabel } from './display'

/**
 * Extracts the most nested subcategory from a Fides taxonomy path.
 *
 * @example
 * getLeafCategory('user.derived.identifiable.device.cookie_id') // -> 'cookie_id'
 * getLeafCategory('financial') // -> 'financial'
 */
export const getLeafCategory = (category: string): string => category.split('.').pop() ?? category

/**
 * Returns deduplicated leaf categories across all privacy declarations.
 * Returns empty array for systems with no declarations (e.g. search_database).
 *
 * @example
 * getUniqueLeafCategories(storeApp) // -> ['cookie_id', 'ip_address', 'location', 'email']
 */
export const getUniqueLeafCategories = (system: System): readonly string[] => [
  ...new Set(system.privacy_declarations.flatMap((d) => d.data_categories).map(getLeafCategory)),
]

/**
 * Returns unique data_use values across all declarations for a system.
 *
 * @example
 * getSystemDataUses(storeApp) // -> ['advertising.third_party', 'advertising.first_party', 'improve.system']
 */
const getSystemDataUses = (system: System): readonly string[] => [
  ...new Set(system.privacy_declarations.map((d) => d.data_use)),
]

/**
 * Groups systems by the specified layout mode.
 *
 * BySystemType: one group per system_type, each system in exactly one group.
 * ByDataUse: one group per data_use, systems with multiple uses appear in multiple groups.
 *   search_database (no declarations) appears in no ByDataUse group.
 *
 * Receives ALL systems (not filtered) so the grid stays stable during filtering.
 *
 * @example
 * groupSystems(SYSTEMS, LayoutMode.BySystemType) // -> [{ key: 'Application', ... }, ...]
 */
export const groupSystems = (systems: readonly System[], mode: LayoutMode): readonly SystemGroup[] => {
  const groups = new Map<string, System[]>()

  if (mode === LayoutMode.BySystemType) {
    for (const system of systems) {
      const key = system.system_type
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(system)
    }
  } else {
    for (const system of systems) {
      const uses = getSystemDataUses(system)
      for (const use of uses) {
        if (!groups.has(use)) groups.set(use, [])
        groups.get(use)!.push(system)
      }
    }
  }

  // System Type: logical data flow order. Data Use: alphabetical.
  const SYSTEM_TYPE_ORDER: Readonly<Record<string, number>> = {
    Application: 0,
    Service: 1,
    Database: 2,
    Integration: 3,
  }

  const sortFn =
    mode === LayoutMode.BySystemType
      ? ([a]: [string, System[]], [b]: [string, System[]]) =>
          (SYSTEM_TYPE_ORDER[a] ?? 99) - (SYSTEM_TYPE_ORDER[b] ?? 99)
      : ([a]: [string, System[]], [b]: [string, System[]]) => a.localeCompare(b)

  return [...groups.entries()].sort(sortFn).map(([key, systems]) => ({
    key,
    label: DATA_USE_LABELS.get(key) ?? toDisplayLabel(key),
    systems,
  }))
}

/**
 * Filters systems based on active data use and category selections.
 *
 * - Data use: system passes if ANY declaration has the selected data_use (OR across declarations)
 * - Categories: system passes if ALL selected leaf categories appear somewhere across
 *   its declarations (AND across selected, OR across declarations per category)
 * - Combined: both conditions must pass (AND between the two filters)
 * - search_database: filtered out when any filter is active (no declarations to match)
 *
 * @example
 * filterSystems(SYSTEMS, 'advertising.third_party', []) // -> systems with third-party ads
 * filterSystems(SYSTEMS, null, ['cookie_id', 'email'])   // -> systems with BOTH cookie_id AND email
 */
export const filterSystems = (
  systems: readonly System[],
  dataUse: string | null,
  categories: readonly string[],
): readonly System[] =>
  systems.filter((system) => {
    if (dataUse !== null) {
      const hasUse = system.privacy_declarations.some((d) => d.data_use === dataUse)
      if (!hasUse) return false
    }

    if (categories.length > 0) {
      const allLeaves = new Set(system.privacy_declarations.flatMap((d) => d.data_categories).map(getLeafCategory))
      const hasAll = categories.every((cat) => allLeaves.has(cat))
      if (!hasAll) return false
    }

    return true
  })

/**
 * Returns all unique data_use values across all systems, sorted alphabetically.
 * Derived from data — scales to any dataset.
 */
export const getAllDataUses = (systems: readonly System[]): readonly string[] =>
  [...new Set(systems.flatMap((s) => s.privacy_declarations.map((d) => d.data_use)))].sort()

/**
 * Returns all unique leaf categories across all systems, sorted alphabetically.
 * Derived from data — scales to any dataset.
 */
export const getAllLeafCategories = (systems: readonly System[]): readonly string[] =>
  [
    ...new Set(systems.flatMap((s) => s.privacy_declarations.flatMap((d) => d.data_categories)).map(getLeafCategory)),
  ].sort()

/**
 * Returns dependency edges where BOTH endpoints are in the active set.
 * Returns [sourceKey, targetKey] where source depends on target.
 *
 * @example
 * resolveDependencyEdges(activeSystems) // -> [['store_app', 'app_database'], ...]
 */
export const resolveDependencyEdges = (activeSystems: readonly System[]): readonly [string, string][] => {
  const activeKeys = new Set(activeSystems.map((s) => s.fides_key))
  return activeSystems.flatMap((system) =>
    system.system_dependencies
      .filter((dep) => activeKeys.has(dep))
      .map((dep) => [system.fides_key, dep] as [string, string]),
  )
}
