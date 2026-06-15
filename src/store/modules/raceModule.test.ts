import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import raceModule from './raceModule'
import horsesModule from './horsesModule'
import { RaceStatus } from '~/types/race'
import type { RootState } from '~/types/store'
import { ROUND_SPECS } from '~/constants/race'

function buildStore() {
  return createStore<RootState>({
    modules: {
      horses: horsesModule,
      race:   raceModule,
    },
  })
}

describe('raceModule', () => {
  let store: ReturnType<typeof buildStore>

  beforeEach(() => {
    localStorage.clear()
    store = buildStore()
  })

  it('starts with Idle status', () => {
    expect(store.state.race.status).toBe(RaceStatus.Idle)
  })

  it('starts with an empty schedule', () => {
    expect(store.state.race.schedule).toEqual([])
  })

  it('setStatus updates status', async () => {
    await store.dispatch('race/setStatus', RaceStatus.Running)
    expect(store.state.race.status).toBe(RaceStatus.Running)
  })

  it('resetRace clears schedule and results', async () => {
    await store.dispatch('race/setStatus', RaceStatus.Running)
    await store.dispatch('race/resetRace')
    expect(store.state.race.schedule).toEqual([])
    expect(store.state.race.completedRounds).toEqual([])
    expect(store.state.race.currentRoundIndex).toBe(0)
    expect(store.state.race.status).toBe(RaceStatus.Idle)
  })

  it('generateProgram creates 6 rounds with up to 10 horses each', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    const { schedule } = store.state.race
    const availableCount = store.state.horses.horses.length
    expect(schedule.length).toBe(6)
    schedule.forEach((round) => {
      expect(round.horseIds.length).toBeLessThanOrEqual(10)
      expect(round.horseIds.length).toBe(Math.min(availableCount, 10))
    })
  })

  it('generateProgram assigns correct specs', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    store.state.race.schedule.forEach((round, index) => {
      expect(round.spec).toEqual(ROUND_SPECS[index])
    })
  })

  it('completeRound adds to completedRounds', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    const results = [{ position: 1, horseId: 1 }]
    await store.dispatch('race/completeRound', results)
    expect(store.state.race.completedRounds.length).toBe(1)
    expect(store.state.race.completedRounds[0].results).toEqual(results)
  })

  it('advanceRound increments currentRoundIndex', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    expect(store.state.race.currentRoundIndex).toBe(0)
    await store.dispatch('race/advanceRound')
    expect(store.state.race.currentRoundIndex).toBe(1)
  })

  it('generateProgram persists schedule to localStorage', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    const stored = localStorage.getItem('race_schedule')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.length).toBe(6)
  })

  it('completeRound persists completed rounds to localStorage', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    await store.dispatch('race/completeRound', [{ position: 1, horseId: 1 }])
    const stored = localStorage.getItem('race_completed_rounds')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.length).toBe(1)
  })

  it('loads persisted schedule and completed rounds from localStorage on init', () => {
    const mockSchedule  = [{ spec: ROUND_SPECS[0], horseIds: [1,2,3,4,5,6,7,8,9,10] }]
    const mockCompleted = [{ roundIndex: 0, results: [{ position: 1, horseId: 1 }] }]
    localStorage.setItem('race_schedule',         JSON.stringify(mockSchedule))
    localStorage.setItem('race_completed_rounds', JSON.stringify(mockCompleted))

    const freshStore = buildStore()
    expect(freshStore.state.race.schedule.length).toBe(1)
    expect(freshStore.state.race.completedRounds.length).toBe(1)
    expect(freshStore.state.race.currentRoundIndex).toBe(1)
  })

  it('resetRace persists empty arrays to localStorage', async () => {
    await store.dispatch('horses/initHorses')
    await store.dispatch('race/generateProgram')
    await store.dispatch('race/resetRace')
    const storedSchedule = JSON.parse(localStorage.getItem('race_schedule') ?? '[]')
    const storedCompleted = JSON.parse(localStorage.getItem('race_completed_rounds') ?? '[]')
    expect(storedSchedule).toEqual([])
    expect(storedCompleted).toEqual([])
  })
})
