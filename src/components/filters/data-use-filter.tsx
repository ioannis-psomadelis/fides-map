import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DATA_USE_LABELS, SYSTEMS } from '@/data/sample-data'
import { useAppStore } from '@/stores/use-app-store'
import { getAllDataUses } from '@/utils/data-transform'

const dataUses = getAllDataUses(SYSTEMS)

export const DataUseFilter = () => {
  const activeDataUse = useAppStore((s) => s.activeDataUse)
  const setDataUse = useAppStore((s) => s.setDataUse)

  return (
    <Select value={activeDataUse ?? 'all'} onValueChange={(value) => setDataUse(value === 'all' ? null : value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Data Uses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Data Uses</SelectItem>
        {dataUses.map((use) => (
          <SelectItem key={use} value={use}>
            {DATA_USE_LABELS.get(use)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
