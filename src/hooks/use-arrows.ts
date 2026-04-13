import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import type { DependencyArrow } from '../types'

export const useArrows = (containerRef: RefObject<HTMLElement | null>, edges: readonly [string, string][]) => {
  const [arrows, setArrows] = useState<DependencyArrow[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const recalculate = useCallback(() => {
    const container = containerRef.current
    if (!container || edges.length === 0) {
      setArrows([])
      return
    }

    const containerRect = container.getBoundingClientRect()
    const cards = container.querySelectorAll<HTMLElement>('[data-fides-key]')
    const positions = new Map<string, DOMRect>()
    cards.forEach((card) => {
      const key = card.dataset.fidesKey
      if (key) positions.set(key, card.getBoundingClientRect())
    })

    const newArrows: DependencyArrow[] = edges
      .filter(([src, tgt]) => positions.has(src) && positions.has(tgt))
      .map(([sourceKey, targetKey]) => {
        const s = positions.get(sourceKey)!
        const t = positions.get(targetKey)!

        // Source exits from right edge, target enters at left edge
        const sx = s.right - containerRect.left
        const sy = s.top + s.height / 2 - containerRect.top
        const tx = t.left - containerRect.left
        const ty = t.top + t.height / 2 - containerRect.top

        // Horizontal bezier — control points push outward for a clean curve
        const dx = Math.abs(tx - sx)
        // 40% of horizontal span gives a natural arc; floor at 30px so close cards still curve
        const cpOffset = Math.max(dx * 0.4, 30)

        return {
          id: `${sourceKey}-${targetKey}`,
          sourceKey,
          targetKey,
          path: `M ${sx} ${sy} C ${sx + cpOffset} ${sy}, ${tx - cpOffset} ${ty}, ${tx} ${ty}`,
        }
      })
    setArrows(newArrows)
  }, [containerRef, edges])

  const debouncedRecalculate = useCallback(() => {
    clearTimeout(debounceRef.current)
    // 50ms coalesces ResizeObserver bursts from CSS transitions
    debounceRef.current = setTimeout(recalculate, 50)
  }, [recalculate])

  useEffect(() => {
    debouncedRecalculate()

    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(debouncedRecalculate)
    observer.observe(container)

    window.addEventListener('resize', debouncedRecalculate)

    return () => {
      clearTimeout(debounceRef.current)
      observer.disconnect()
      window.removeEventListener('resize', debouncedRecalculate)
    }
  }, [debouncedRecalculate, containerRef])

  return { arrows }
}
