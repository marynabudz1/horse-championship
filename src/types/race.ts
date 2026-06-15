export enum RaceStatus {
  Idle     = 'idle',
  Running  = 'running',
  Paused   = 'paused',
  Finished = 'finished',
}

export interface RoundSpec {
  round: number
  distance: number
  label: string
}

export interface RoundSchedule {
  spec: RoundSpec
  horseIds: number[]
}

export interface RoundResult {
  position: number
  horseId: number
}

export interface CompletedRound {
  roundIndex: number
  results: RoundResult[]
}

export interface HorseProgress {
  horseId: number
  progress: number
  finished: boolean
  finishTime: number | null
  lane: number
}
