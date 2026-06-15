import type { RoundSpec } from '~/types/race'

export const ROUND_SPECS: RoundSpec[] = [
  { round: 1, distance: 1200, label: '1ST Lap - 1200m' },
  { round: 2, distance: 1400, label: '2ST Lap - 1400m' },
  { round: 3, distance: 1600, label: '3ST Lap - 1600m' },
  { round: 4, distance: 1800, label: '4ST Lap - 1800m' },
  { round: 5, distance: 2000, label: '5ST Lap - 2000m' },
  { round: 6, distance: 2200, label: '6ST Lap - 2200m' },
]

export const TOTAL_HORSES     = 20
export const MIN_HORSES       = 1
export const HORSES_PER_ROUND = 10
export const TOTAL_ROUNDS = 6
export const ANIMATION_BASE_MS      = 2600
export const ANIMATION_MIN_CONDITION = 60

/** Maximum left-offset percentage for a horse sprite — leaves room for the finish line */
export const TRACK_FINISH_PERCENT = 88
