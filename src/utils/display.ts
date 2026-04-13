/**
 * Returns human-readable label for any taxonomy value.
 * Auto-formats the last dot-segment into Title Case.
 *
 * @example
 * toDisplayLabel('cookie_id')               // -> 'Cookie Id'
 * toDisplayLabel('Application')             // -> 'Application' (passthrough)
 * toDisplayLabel('some.deep.path.value')    // -> 'Value'
 */
export const toDisplayLabel = (value: string): string =>
  value
    .split('.')
    .pop()!
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
