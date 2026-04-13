import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/use-app-store'

export const MobileBackdrop = () => {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const collapseSidebar = useAppStore((s) => s.collapseSidebar)

  return (
    <div
      className={cn(
        'fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 lg:hidden',
        sidebarCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      onClick={collapseSidebar}
      aria-hidden="true"
    />
  )
}
