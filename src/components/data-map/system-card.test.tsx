import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SYSTEMS } from '../../data/sample-data'
import { LayoutMode } from '../../types'
import { SystemCard } from './system-card'

const storeApp = SYSTEMS.find((s) => s.fides_key === 'store_app')!
const defaultProps = {
  system: storeApp,
  isFilteredOut: false,
  isHovered: false,
  isHighlighted: false,
  someCardHovered: false,
  onHover: () => {},
  layoutMode: LayoutMode.BySystemType,
}

describe('SystemCard', () => {
  it('renders system name', () => {
    render(<SystemCard {...defaultProps} />)
    expect(screen.getByText('Example.com Online Storefront')).toBeInTheDocument()
  })

  it('renders leaf categories as display labels not full paths', () => {
    render(<SystemCard {...defaultProps} />)
    expect(screen.getByText('cookie_id')).toBeInTheDocument()
    expect(screen.queryByText('user.derived.identifiable.device.cookie_id')).not.toBeInTheDocument()
  })

  it('has data-fides-key attribute', () => {
    const { container } = render(<SystemCard {...defaultProps} />)
    expect(container.querySelector('[data-fides-key="store_app"]')).toBeInTheDocument()
  })

  it('renders primary data use from declaration name', () => {
    render(<SystemCard {...defaultProps} />)
    expect(screen.getByText('Online Advertising')).toBeInTheDocument()
  })
})
