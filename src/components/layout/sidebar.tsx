import { FilterPanel } from '@/components/filters/filter-panel'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/use-app-store'

export const Sidebar = () => {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <>
      {/* Desktop sidebar — width transition so main content fills gap */}
      <aside
        className={cn(
          'hidden lg:flex relative z-30 shrink-0 border-r border-sidebar-border bg-sidebar-bg',
          'flex-col overflow-hidden',
          'transition-[width] duration-300 ease-out',
          sidebarCollapsed ? 'w-0 border-r-0' : 'w-56 2xl:w-72',
        )}
      >
        <div className="w-56 2xl:w-72 min-w-0">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-lg font-semibold text-text-primary font-display tracking-tight">Filters</h2>
          </div>
          <FilterPanel />
        </div>
      </aside>

      {/* Mobile sidebar — fixed overlay with translateX */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-30 w-72 border-r border-sidebar-border bg-surface-raised',
          'flex flex-col overflow-y-auto',
          'transition-transform duration-300 ease-out',
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0',
        )}
      >
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-lg font-semibold text-text-primary font-display tracking-tight">Filters</h2>
        </div>
        <FilterPanel />
      </aside>
    </>
  )
}
