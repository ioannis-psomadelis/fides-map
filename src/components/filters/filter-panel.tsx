import { ActiveChips } from './active-chips'
import { CategoryFilter } from './category-filter'
import { DataUseFilter } from './data-use-filter'

export const FilterPanel = () => {
  return (
    <div className="space-y-8 p-5">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary font-display">Data Use</h3>
        <DataUseFilter />
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary font-display">Categories</h3>
        <CategoryFilter />
      </div>
      <ActiveChips />
    </div>
  )
}
