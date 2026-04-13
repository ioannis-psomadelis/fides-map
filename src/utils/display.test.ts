import { describe, expect, it } from 'vitest'
import { toDisplayLabel } from './display'

describe('toDisplayLabel', () => {
  it('auto-formats values from last dot-segment into title case', () => {
    expect(toDisplayLabel('cookie_id')).toBe('Cookie Id')
    expect(toDisplayLabel('ip_address')).toBe('Ip Address')
    expect(toDisplayLabel('Application')).toBe('Application')
    expect(toDisplayLabel('some.deep.path.value_name')).toBe('Value Name')
  })

  it('extracts last segment from dot-notation paths', () => {
    expect(toDisplayLabel('marketing.direct')).toBe('Direct')
    expect(toDisplayLabel('advertising.third_party')).toBe('Third Party')
  })
})
