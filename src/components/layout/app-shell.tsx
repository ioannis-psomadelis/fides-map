import { DataMap } from '@/components/data-map/data-map'
import { MobileBackdrop } from './mobile-backdrop'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

export const AppShell = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-base">
      <Sidebar />
      <MobileBackdrop />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto canvas-scrollbar">
          <DataMap />
        </main>
      </div>
    </div>
  )
}
