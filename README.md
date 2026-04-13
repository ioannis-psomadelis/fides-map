# Fides Map

An interactive privacy data map that visualizes systems, their data categories, data uses, and dependency relationships. Built for the Ethyca Senior Front-End Engineer take-home assessment.

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # 21 tests across 3 suites
pnpm lint       # biome check
pnpm format     # biome check --write
pnpm build      # production build
```

## Time Spent

Roughly 4 hours:
- ~15 min exploring the data, modeling types, sketching the layout
- ~3 hrs building components, state, arrows, filtering, theming
- ~30 min writing tests, cleanup, readme

## What I Built

A column-based data map where systems sit in vertical lanes grouped by type or data use. Cards show the system name, clickable category badges, and the primary data use. Hover a card to see dependency arrows and the full chain highlighted. Toggle between layouts and the cards animate into place using the View Transitions API.

I wanted it to feel like a workspace tool, not a static table - the dot-grid canvas, gradient arrows, and fade-based filtering all push in that direction.

### Features

- Two layout modes (System Type / Data Use) with animated reflow via the View Transitions API
- SVG bezier dependency arrows with gradient endpoints, recalculated on resize. Three states: direct connection, chain, idle
- Filtered systems fade rather than unmount - the layout stays stable so you don't lose your place
- Category and data use badges on cards are clickable filters
- Dark/light mode with OS detection and manual toggle
- Collapsible sidebar, responsive mobile overlay
- Active filter chips with one-click removal
- Responsive from mobile to 2xl - sidebar, header, and card columns all adapt
- Semantic HTML (`article`, `section`, `header`, `aside`), ARIA labels on interactive elements

## Architecture

**Vite 8 + React 19 + TypeScript strict** - static SPA, embedded data, no server. Vite's DX is the best for this scope.

**Tailwind CSS 4** with CSS custom properties for all colors. Dark mode is just overrides on a single set of tokens.

**Zustand** instead of Context - each component subscribes to one slice (`useAppStore(s => s.activeDataUse)`), so only components that care about a change re-render. With Context the whole tree re-renders on any state change. That matters on hover (high frequency) and filter toggles (many subscribers).

**View Transitions API** - progressive enhancement. Chrome/Edge get smooth card animations, everyone else gets an instant switch. No polyfill, no bundle cost.

**Custom SVG arrows** - react-flow would be overkill for 10 nodes. The custom approach shows DOM measurement, coordinate math, and SVG path construction. For 100+ nodes I'd use a library.

**Data-driven labels** - data use labels come from declaration `name` fields, not a hardcoded map. If the data changes, labels follow.

**Inline dedup** - the sample data has a duplicate `orders_service`. Deduplicated with `new Map(systems.map(s => [s.fides_key, s])).values()`. In production with an API, this moves to the transform layer.

**`const` objects over enums** - `erasableSyntaxOnly: true` in TS config means enums can't emit runtime code. `as const` + type aliases give the same checking.

## Assumptions

- Category filter is AND: "systems with BOTH cookie_id AND email" - the useful audit question
- Data use filter is OR across declarations: any matching declaration passes
- Leaf category = last segment of the dot path (`user.derived.identifiable.device.cookie_id` → `cookie_id`)
- `search_database` has no declarations, so it fades when any filter is active
- Systems with multiple data uses appear in all matching columns in Data Use layout
- Arrows only render in System Type mode where spatial relationships are stable
- In Data Use mode, hover still highlights all instances of the same system plus dependency neighbors through card styling

## Trade-offs

| Decision | Why | Gave up |
|----------|-----|---------|
| Fade over unmount | Layout stays stable, filtered cards still visible | More visual noise |
| Arrows hidden until hover | Clean default view | Less discoverable |
| Card rings over arrows in Data Use mode | Duplicate nodes make edges chaotic | Less obvious connectivity |
| No URL filter persistence | Simpler state | Can't share filtered views |

## Testing

21 tests across 3 suites (Vitest + React Testing Library + happy-dom):

- **`display.test.ts`** - label formatting: dot-segment extraction, underscore-to-space, title casing
- **`data-transform.test.ts`** - grouping, filtering (AND categories, OR data uses), dependency edges, dedup
- **`system-card.test.tsx`** - card rendering: name, categories, `data-fides-key`, primary data use

I focused on the data layer because that's where silent bugs hurt most - wrong filter logic or broken grouping makes the map misleading. Visual stuff (arrows, hover, transitions) I verified by hand.

## Edge Cases

- **Duplicate systems** - `orders_service` appears twice in sample data, deduplicated by `fides_key`
- **Empty declarations** - `search_database` has none, card renders without badges, fades on any filter
- **Empty results** - all systems filtered out shows an empty state message
- **Toggle deselect** - Radix ToggleGroup can fire empty values, guarded at the handler
- **Theme persistence** - reads `localStorage`, falls back to OS preference

## With More Time

- URL filter state via `replaceState` + hydrate on mount
- API or drag-and-drop import with validation in the transform layer
- Zoom/pan for larger datasets (CSS transforms + wheel/pinch)
- E2E tests with Playwright
- Virtualized rendering past a few hundred systems
- Error boundaries around the map and sidebar

## Screenshots
#### Desktop Dark
<img width="2056" height="1173" alt="Screenshot 2026-04-13 at 19 28 46" src="https://github.com/user-attachments/assets/09d70b08-1694-4eb7-a9d1-1e39f1f9b7aa" />
<img width="2056" height="1169" alt="Screenshot 2026-04-13 at 19 28 58" src="https://github.com/user-attachments/assets/cb407bd8-0810-4198-b5d6-d5635627f0ad" />


#### Desktop Light
<img width="2055" height="1170" alt="Screenshot 2026-04-13 at 19 28 37" src="https://github.com/user-attachments/assets/cef30534-bb34-486e-b107-4a78f78a70a1" />


#### Responsive
https://github.com/user-attachments/assets/b5b2ab20-6f09-4d9a-af64-e8d333872969
