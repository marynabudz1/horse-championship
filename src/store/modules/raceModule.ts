import type { Module, MutationTree, ActionTree } from 'vuex'
import type { RaceState, RootState } from '~/types/store'
import type { RoundSchedule, CompletedRound, RoundResult } from '~/types/race'
import { RaceStatus } from '~/types/race'
import { ROUND_SPECS, HORSES_PER_ROUND } from '~/constants/race'
import { saveToStorage, loadFromStorage } from '~/composables/useLocalStorage'

const STORAGE_KEY_SCHEDULE        = 'race_schedule'
const STORAGE_KEY_COMPLETED_ROUNDS = 'race_completed_rounds'

function buildInitialState(): RaceState {
  const persistedSchedule        = loadFromStorage<RoundSchedule[]>(STORAGE_KEY_SCHEDULE)        ?? []
  const persistedCompletedRounds = loadFromStorage<CompletedRound[]>(STORAGE_KEY_COMPLETED_ROUNDS) ?? []

  return {
    schedule:           persistedSchedule,
    completedRounds:    persistedCompletedRounds,
    currentRoundIndex:  persistedCompletedRounds.length,
    status:             RaceStatus.Idle,
  }
}

// Factory function so each store instance gets its own fresh state (required for testability)
const state = (): RaceState => buildInitialState()

const mutations: MutationTree<RaceState> = {
  SET_SCHEDULE(raceState: RaceState, schedule: RoundSchedule[]) {
    raceState.schedule = schedule
    saveToStorage<RoundSchedule[]>(STORAGE_KEY_SCHEDULE, schedule)
  },

  SET_STATUS(raceState: RaceState, status: RaceStatus) {
    raceState.status = status
  },

  ADD_COMPLETED_ROUND(raceState: RaceState, completedRound: CompletedRound) {
    raceState.completedRounds = [...raceState.completedRounds, completedRound]
    saveToStorage<CompletedRound[]>(STORAGE_KEY_COMPLETED_ROUNDS, raceState.completedRounds)
  },

  SET_CURRENT_ROUND_INDEX(raceState: RaceState, roundIndex: number) {
    raceState.currentRoundIndex = roundIndex
  },

  RESET_RACE(raceState: RaceState) {
    raceState.schedule          = []
    raceState.completedRounds   = []
    raceState.currentRoundIndex = 0
    raceState.status            = RaceStatus.Idle
    saveToStorage<RoundSchedule[]>(STORAGE_KEY_SCHEDULE, [])
    saveToStorage<CompletedRound[]>(STORAGE_KEY_COMPLETED_ROUNDS, [])
  },
}

const actions: ActionTree<RaceState, RootState> = {
  generateProgram({ commit, rootState }) {
    const allHorseIds = rootState.horses.horses.map((horse) => horse.id)
    // Use however many horses are available — up to HORSES_PER_ROUND per round
    const horsesPerRound = Math.min(allHorseIds.length, HORSES_PER_ROUND)

    const roundSchedules: RoundSchedule[] = ROUND_SPECS.map((roundSpec) => {
      const shuffledIds = [...allHorseIds].sort(() => Math.random() - 0.5)
      const selectedIds = shuffledIds.slice(0, horsesPerRound)
      return { spec: roundSpec, horseIds: selectedIds }
    })

    commit('RESET_RACE')
    commit('SET_SCHEDULE', roundSchedules)
    commit('SET_CURRENT_ROUND_INDEX', 0)
  },

  advanceRound({ commit, state: raceState }) {
    commit('SET_CURRENT_ROUND_INDEX', raceState.currentRoundIndex + 1)
  },

  completeRound({ commit, state: raceState }, results: RoundResult[]) {
    const completedRound: CompletedRound = {
      roundIndex: raceState.currentRoundIndex,
      results,
    }
    commit('ADD_COMPLETED_ROUND', completedRound)
  },

  resetRace({ commit }) {
    commit('RESET_RACE')
  },

  setStatus({ commit }, status: RaceStatus) {
    commit('SET_STATUS', status)
  },
}

const raceModule: Module<RaceState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default raceModule
