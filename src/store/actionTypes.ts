export const HorseActions = {
  INIT_HORSES: 'horses/initHorses',
} as const

export const RaceActions = {
  GENERATE_PROGRAM: 'race/generateProgram',
  ADVANCE_ROUND:    'race/advanceRound',
  COMPLETE_ROUND:   'race/completeRound',
  RESET_RACE:       'race/resetRace',
  SET_STATUS:       'race/setStatus',
} as const
