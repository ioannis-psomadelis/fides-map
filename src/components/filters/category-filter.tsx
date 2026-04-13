import { Checkbox } from '@/components/ui/checkbox'
import { SYSTEMS } from '@/data/sample-data'
import { useAppStore } from '@/stores/use-app-store'
import { getAllLeafCategories } from '@/utils/data-transform'

const categories = getAllLeafCategories(SYSTEMS)

export const CategoryFilter = () => {
  const activeCategories = useAppStore((s) => s.activeCategories)
  const toggleCategory = useAppStore((s) => s.toggleCategory)

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <label
          key={cat}
          className="flex items-center gap-3 cursor-pointer text-xs uppercase tracking-wide text-text-secondary hover:text-text-primary transition-colors"
        >
          <Checkbox checked={activeCategories.includes(cat)} onCheckedChange={() => toggleCategory(cat)} />
          <span>{cat}</span>
        </label>
      ))}
    </div>
  )
}
