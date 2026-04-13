import { describe, expect, it } from 'vitest'
import { SYSTEMS } from '../data/sample-data'
import { LayoutMode } from '../types'
import {
  filterSystems,
  getLeafCategory,
  getUniqueLeafCategories,
  groupSystems,
  resolveDependencyEdges,
} from './data-transform'

describe('getLeafCategory', () => {
  it('extracts last segment from deep path', () => {
    expect(getLeafCategory('user.derived.identifiable.device.cookie_id')).toBe('cookie_id')
  })
  it('returns original when no dots', () => {
    expect(getLeafCategory('financial')).toBe('financial')
  })
})

describe('getUniqueLeafCategories', () => {
  it('deduplicates across multiple declarations', () => {
    const storeApp = SYSTEMS.find((s) => s.fides_key === 'store_app')!
    const leaves = getUniqueLeafCategories(storeApp)
    const cookieCount = leaves.filter((l) => l === 'cookie_id').length
    expect(cookieCount).toBe(1)
  })
  it('returns empty array for system with no declarations', () => {
    const searchDb = SYSTEMS.find((s) => s.fides_key === 'search_database')!
    expect(getUniqueLeafCategories(searchDb)).toEqual([])
  })
})

describe('filterSystems', () => {
  it('returns all when no filters active', () => {
    expect(filterSystems(SYSTEMS, null, [])).toHaveLength(10)
  })
  it('filters by data use (OR across declarations)', () => {
    const result = filterSystems(SYSTEMS, 'advertising.third_party', [])
    expect(result.length).toBeGreaterThan(0)
    result.forEach((s) => {
      const uses = s.privacy_declarations.map((d) => d.data_use)
      expect(uses).toContain('advertising.third_party')
    })
  })
  it('AND logic for categories across declarations', () => {
    const result = filterSystems(SYSTEMS, null, ['cookie_id', 'email'])
    result.forEach((s) => {
      const allCategories = s.privacy_declarations.flatMap((d) => d.data_categories).map((c) => c.split('.').pop()!)
      expect(allCategories).toEqual(expect.arrayContaining(['cookie_id', 'email']))
    })
  })
  it('empty result when nothing matches', () => {
    expect(filterSystems(SYSTEMS, 'nonexistent.use', [])).toHaveLength(0)
  })
})

describe('groupSystems', () => {
  it('groups by system type with search_database in Database group', () => {
    const groups = groupSystems(SYSTEMS, LayoutMode.BySystemType)
    const dbGroup = groups.find((g) => g.key === 'Database')
    expect(dbGroup).toBeDefined()
    expect(dbGroup!.systems.some((s) => s.fides_key === 'search_database')).toBe(true)
  })
  it('system with multiple data uses appears in multiple ByDataUse groups', () => {
    const groups = groupSystems(SYSTEMS, LayoutMode.ByDataUse)
    const storeAppGroups = groups.filter((g) => g.systems.some((s) => s.fides_key === 'store_app'))
    expect(storeAppGroups.length).toBeGreaterThanOrEqual(3)
  })
  it('search_database appears in no ByDataUse group', () => {
    const groups = groupSystems(SYSTEMS, LayoutMode.ByDataUse)
    const searchDbGroups = groups.filter((g) => g.systems.some((s) => s.fides_key === 'search_database'))
    expect(searchDbGroups).toHaveLength(0)
  })
})

describe('resolveDependencyEdges', () => {
  it('returns edges where both endpoints are in the active set', () => {
    const edges = resolveDependencyEdges(SYSTEMS)
    edges.forEach(([src, tgt]) => {
      expect(SYSTEMS.some((s) => s.fides_key === src)).toBe(true)
      expect(SYSTEMS.some((s) => s.fides_key === tgt)).toBe(true)
    })
  })
  it('excludes edges when target is not in active set', () => {
    const subset = SYSTEMS.filter((s) => s.fides_key !== 'app_database')
    const edges = resolveDependencyEdges(subset)
    edges.forEach(([, tgt]) => {
      expect(tgt).not.toBe('app_database')
    })
  })
  it('returns empty for systems with no dependencies', () => {
    const leaf = SYSTEMS.filter((s) => s.system_dependencies.length === 0)
    expect(resolveDependencyEdges(leaf)).toHaveLength(0)
  })
})

describe('sample data', () => {
  it('contains 10 unique systems after dedup', () => {
    expect(SYSTEMS).toHaveLength(10)
    const keys = SYSTEMS.map((s) => s.fides_key)
    expect(new Set(keys).size).toBe(10)
  })
})
