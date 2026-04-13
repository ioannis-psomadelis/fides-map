import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SYSTEMS } from '@/data/sample-data'
import { useFilteredData } from '@/hooks/use-filtered-data'
import { useAppStore } from '@/stores/use-app-store'
import { LayoutMode, Theme } from '@/types'
import { SidebarToggle } from './sidebar-toggle'

export const TopBar = () => {
  const layoutMode = useAppStore((s) => s.layoutMode)
  const setLayoutMode = useAppStore((s) => s.setLayoutMode)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const { visibleCount } = useFilteredData()

  const isLayoutMode = (v: string): v is LayoutMode => Object.values(LayoutMode).includes(v as LayoutMode)

  const handleLayoutChange = (value: string) => {
    if (!isLayoutMode(value)) return
    const mode = value
    if (!document.startViewTransition) {
      setLayoutMode(mode)
      return
    }
    // flushSync required — startViewTransition captures snapshots synchronously,
    // but React batches state updates asynchronously by default
    document.startViewTransition(() => {
      flushSync(() => {
        setLayoutMode(mode)
      })
    })
  }

  return (
    <header className="flex items-center justify-between gap-2 border-b border-surface-border bg-surface-raised px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarToggle />
        <h1 className="text-base sm:text-xl font-semibold text-text-primary font-display tracking-tight whitespace-nowrap">
          Data Map
        </h1>
      </div>

      <ToggleGroup
        type="single"
        value={layoutMode}
        onValueChange={handleLayoutChange}
        className="bg-surface-base rounded-lg p-0.5 sm:p-1"
      >
        <ToggleGroupItem
          value={LayoutMode.BySystemType}
          className="rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium data-[state=on]:bg-surface-raised data-[state=on]:text-text-primary data-[state=on]:shadow-sm"
        >
          By Type
        </ToggleGroupItem>
        <ToggleGroupItem
          value={LayoutMode.ByDataUse}
          className="rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium data-[state=on]:bg-surface-raised data-[state=on]:text-text-primary data-[state=on]:shadow-sm"
        >
          By Use
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden sm:inline text-sm text-text-muted">
          Showing {visibleCount} of {SYSTEMS.length}
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-1.5 sm:p-2 text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary cursor-pointer"
          aria-label={theme === Theme.Dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === Theme.Dark ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
          )}
        </button>
      </div>
    </header>
  )
}
