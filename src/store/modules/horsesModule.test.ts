import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import horsesModule from './horsesModule'
import type { RootState } from '~/types/store'
import { HORSE_NAMES } from '~/constants/horses'

function buildStore() {
  return createStore<RootState>({
    modules: {
      horses: horsesModule,
      race:   {
        namespaced: true,
        state:      { schedule: [], completedRounds: [], currentRoundIndex: 0, status: 'idle' as const },
        mutations:  {},
        actions:    {},
      },
    },
  })
}

describe('horsesModule', () => {
  let store: ReturnType<typeof buildStore>

  beforeEach(() => {
    store = buildStore()
  })

  it('starts with an empty horses array', () => {
    expect(store.state.horses.horses).toEqual([])
  })

  it('initHorses generates between 1 and 20 horses', async () => {
    await store.dispatch('horses/initHorses')
    const count = store.state.horses.horses.length
    expect(count).toBeGreaterThanOrEqual(1)
    expect(count).toBeLessThanOrEqual(20)
  })

  it('generated horses have sequential ids starting at 1', async () => {
    await store.dispatch('horses/initHorses')
    const ids = store.state.horses.horses.map((h) => h.id)
    expect(ids).toEqual(Array.from({ length: ids.length }, (_, i) => i + 1))
  })

  it('generated horses use names from the predefined list', async () => {
    await store.dispatch('horses/initHorses')
    const names = store.state.horses.horses.map((h) => h.name)
    names.forEach((name) => expect(HORSE_NAMES).toContain(name))
  })

  it('generated horses have condition between 1 and 100', async () => {
    await store.dispatch('horses/initHorses')
    store.state.horses.horses.forEach((horse) => {
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })
  })

  it('generated horses have a color string', async () => {
    await store.dispatch('horses/initHorses')
    store.state.horses.horses.forEach((horse) => {
      expect(typeof horse.color).toBe('string')
      expect(horse.color.startsWith('#')).toBe(true)
    })
  })
})
