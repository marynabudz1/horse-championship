import type { Horse } from './horse'
import type { RoundSchedule, CompletedRound, RaceStatus } from './race'

export interface HorsesState {
  horses: Horse[]
}

export interface RaceState {
  schedule: RoundSchedule[]
  completedRounds: CompletedRound[]
  currentRoundIndex: number
  status: RaceStatus
}

export interface RootState {
  horses: HorsesState
  race: RaceState
}
