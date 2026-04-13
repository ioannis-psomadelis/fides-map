import { useEffect } from 'react'
import { AppShell } from './components/layout/app-shell'
import { useAppStore } from './stores/use-app-store'
import { Theme } from './types'

export const App = () => {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.Dark)
  }, [theme])

  return <AppShell />
}
