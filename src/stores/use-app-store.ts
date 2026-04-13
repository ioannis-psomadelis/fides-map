import { create } from 'zustand'
import { LayoutMode, Theme } from '../types'

interface AppStore {
  // Filter state
  activeDataUse: string | null
  activeCategories: readonly string[]
  layoutMode: LayoutMode
  setDataUse: (use: string | null) => void
  toggleCategory: (cat: string) => void
  setLayoutMode: (mode: LayoutMode) => void
  clearFilters: () => void

  // Sidebar state
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  collapseSidebar: () => void

  // Theme state (persisted to localStorage, synced to DOM via useEffect in App.tsx)
  theme: Theme
  toggleTheme: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Filter state
  activeDataUse: null,
  activeCategories: [],
  layoutMode: LayoutMode.BySystemType,

  setDataUse: (use) => set({ activeDataUse: use }),

  toggleCategory: (cat) =>
    set((state) => ({
      activeCategories: state.activeCategories.includes(cat)
        ? state.activeCategories.filter((c) => c !== cat)
        : [...state.activeCategories, cat],
    })),

  setLayoutMode: (mode) => set({ layoutMode: mode }),
  clearFilters: () => set({ activeDataUse: null, activeCategories: [] }),

  // Sidebar state
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  collapseSidebar: () => set({ sidebarCollapsed: true }),

  // Theme state — reads OS preference as default, localStorage override
  theme: (() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === Theme.Light || stored === Theme.Dark) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light
  })(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === Theme.Dark ? Theme.Light : Theme.Dark
      localStorage.setItem('theme', next)
      return { theme: next }
    }),
}))
