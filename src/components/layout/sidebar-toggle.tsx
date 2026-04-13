import { Menu, X } from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'

export const SidebarToggle = () => {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary cursor-pointer"
      aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
      aria-expanded={!sidebarCollapsed}
    >
      {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
    </button>
  )
}
