import type { DependencyArrow } from '@/types'

interface DependencyArrowsProps {
  readonly arrows: readonly DependencyArrow[]
  readonly hoveredKey: string | null
  readonly highlightedKeys: Set<string>
  readonly activeKeys: Set<string>
}

export const DependencyArrows = ({ arrows, hoveredKey, highlightedKeys, activeKeys }: DependencyArrowsProps) => {
  if (arrows.length === 0) return null

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-1 h-full w-full overflow-visible"
      role="img"
      aria-label="System dependency arrows"
    >
      <defs>
        {arrows.map((arrow) => (
          <linearGradient key={`gradient-${arrow.id}`} id={`gradient-${arrow.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.3" />
            <stop offset="8%" stopColor="var(--color-border)" stopOpacity="1" />
            <stop offset="92%" stopColor="var(--color-border)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0.3" />
          </linearGradient>
        ))}
        <linearGradient id="gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-text-primary)" stopOpacity="0.2" />
          <stop offset="10%" stopColor="var(--color-text-primary)" stopOpacity="1" />
          <stop offset="90%" stopColor="var(--color-text-primary)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-text-primary)" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="gradient-chain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-text-secondary)" stopOpacity="0.2" />
          <stop offset="10%" stopColor="var(--color-text-secondary)" stopOpacity="1" />
          <stop offset="90%" stopColor="var(--color-text-secondary)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-text-secondary)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {arrows.map((arrow) => {
        const bothActive = activeKeys.has(arrow.sourceKey) && activeKeys.has(arrow.targetKey)

        const isDirectlyConnected =
          hoveredKey !== null && (arrow.sourceKey === hoveredKey || arrow.targetKey === hoveredKey)

        // highlightedKeys holds direct neighbours of the hovered card (both directions)
        const isInChain =
          hoveredKey !== null && (highlightedKeys.has(arrow.sourceKey) || highlightedKeys.has(arrow.targetKey))

        let opacity: number
        let strokeWidth: number
        let stroke: string

        if (!bothActive) {
          opacity = 0
          strokeWidth = 0.75
          stroke = `url(#gradient-${arrow.id})`
        } else if (isDirectlyConnected) {
          opacity = 1
          strokeWidth = 1.5
          stroke = 'url(#gradient-active)'
        } else if (isInChain) {
          opacity = 0.5
          strokeWidth = 1
          stroke = 'url(#gradient-chain)'
        } else if (hoveredKey !== null) {
          opacity = 0
          strokeWidth = 0.5
          stroke = `url(#gradient-${arrow.id})`
        } else {
          opacity = 0.25
          strokeWidth = 0.75
          stroke = `url(#gradient-${arrow.id})`
        }

        return (
          <path
            key={arrow.id}
            d={arrow.path}
            fill="none"
            stroke={stroke}
            style={{ opacity, transition: 'opacity 200ms ease' }}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </svg>
  )
}
