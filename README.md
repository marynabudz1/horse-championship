# 🐎 Horse Championship

A horse racing simulation built with **Vue 3 + TypeScript + Vuex + Tailwind CSS**.

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

---

## How to Play

1. **Generate Program** — randomly selects 10 horses per round and builds a 6-round schedule (1200 m → 2200 m)
2. **START** — begins the current round; horses animate across the track in real time
3. **PAUSE / START** — pause and resume mid-race
4. After each round the results are saved and START becomes available for the next round
5. After all 6 rounds the race is finished and START is disabled

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm test` | Vitest unit tests (watch mode) |
| `npm run test:coverage` | Unit tests + coverage report |
| `npm run test:e2e` | Playwright E2E tests (headless) |
| `npm run test:e2e:ui` | Playwright UI mode (visual debugger) |
| `npm run test:e2e:debug` | Playwright step-through debugger |

---

## Architecture

```
src/
├── assets/
│   ├── main.css              # Tailwind directives + gallop keyframe animation
│   └── svg/horseRunning.ts   # Horse SVG path data as typed constants
├── components/
│   ├── ui/                   # Reusable primitives
│   │   ├── AppButton/        # Themed button (primary / secondary variants)
│   │   ├── AppPanel/         # Titled panel wrapper with slot
│   │   ├── ScrollTable/      # Generic scrollable table with colour-swatch column support
│   │   └── TabButton/        # Mobile tab navigation button
│   ├── HorseList/            # Scrollable list of all 20 horses with condition scores
│   ├── Program/              # Schedule panel — one table per round
│   ├── Results/              # Results panel — completed rounds in reverse order
│   └── RaceTrack/
│       ├── HorseSprite/      # Animated SVG horse with RAF-driven position
│       ├── RaceLane/         # Single lane row (number strip + track surface)
│       └── index.tsx         # 10-lane track + finish line + info bar
├── composables/
│   ├── useRaceAnimation.ts   # requestAnimationFrame loop with pause/resume + onUnmounted cleanup
│   └── useLocalStorage.ts    # Generic typed localStorage helpers
├── constants/
│   ├── horses.ts             # 20 horse names + 20 unique hex colours
│   └── race.ts               # Round specs, timing constants, TRACK_FINISH_PERCENT
├── store/
│   ├── index.ts              # Typed store with InjectionKey
│   ├── actionTypes.ts        # Action name constants (no magic strings)
│   └── modules/
│       ├── horsesModule.ts   # Generates 20 horses with random conditions
│       └── raceModule.ts     # Schedule, round progression, status, localStorage persistence
├── types/
│   ├── horse.ts
│   ├── race.ts               # RaceStatus enum + all race interfaces
│   └── store.ts              # RootState shape
└── views/
    └── HomeView.tsx          # Main orchestrator — desktop 3-column + mobile tab layout
```

### Key Design Decisions

- **JSX throughout** — all components use `defineComponent` + `setup()` returning a render function; no `.vue` SFCs
- **Vuex with factory state** — `state: () => buildInitialState()` ensures each store instance hydrates independently from localStorage, keeping tests isolated
- **Animation composable** — `useRaceAnimation` owns the RAF loop and calls `onUnmounted` to cancel any in-flight animation when its host component is destroyed
- **`TRACK_FINISH_PERCENT`** — named constant controlling how far horses travel before the finish line
- **`VITE_E2E_FAST_ANIMATION`** — set to `true` in `.env.e2e` to run races in ~1s during E2E tests without affecting production timing

---

## Testing

### Unit tests (Vitest + @vue/test-utils)
```bash
npm run test:coverage
```
- **100%** statements, functions, lines
- **~93%** branches (remaining gaps are unreachable defensive fallbacks)
- Co-located test files: each component folder contains `index.tsx` + `index.test.ts`

### E2E tests (Playwright)
```bash
npm run test:e2e
```
- **Chromium** — race flow, persistence, edge cases
- **iPhone 13** — mobile tab navigation and auto-navigation to Results

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_E2E_FAST_ANIMATION` | `false` | Set to `true` to run races in ~1s (used by `.env.e2e`) |
