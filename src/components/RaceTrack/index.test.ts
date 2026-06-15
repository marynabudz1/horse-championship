import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceTrack from './index'
import type { Horse } from '~/types/horse'
import type { RoundSchedule, HorseProgress } from '~/types/race'
import { ROUND_SPECS } from '~/constants/race'

const horses: Horse[] = [
  { id: 1, name: 'Thunder', condition: 85, color: '#e74c3c' },
  { id: 2, name: 'Storm',   condition: 72, color: '#3498db' },
]

const currentRound: RoundSchedule = {
  spec:     ROUND_SPECS[0],
  horseIds: [1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
}

const horseProgressList: HorseProgress[] = [
  { horseId: 1, progress: 0.5, finished: false, finishTime: null, lane: 0 },
  { horseId: 2, progress: 0.3, finished: false, finishTime: null, lane: 1 },
]

describe('RaceTrack', () => {
  it('renders 10 lanes', () => {
    const wrapper = mount(RaceTrack, {
      props: { currentRound, horses, horseProgressList, isRunning: false },
    })
    // Each lane has a lane number; numbers 1-10 should all appear
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('10')
  })

  it('shows the round label when a round is provided', () => {
    const wrapper = mount(RaceTrack, {
      props: { currentRound, horses, horseProgressList, isRunning: false },
    })
    expect(wrapper.text()).toContain(ROUND_SPECS[0].label)
  })

  it('shows fallback message when no round is provided', () => {
    const wrapper = mount(RaceTrack, {
      props: { currentRound: null, horses, horseProgressList: [], isRunning: false },
    })
    expect(wrapper.text()).toContain('No race scheduled')
  })

  it('renders horse sprites for horses in the round', () => {
    const wrapper = mount(RaceTrack, {
      props: { currentRound, horses, horseProgressList, isRunning: false },
    })
    expect(wrapper.findAll('svg').length).toBeGreaterThan(0)
  })

  it('renders finish line element', () => {
    const wrapper = mount(RaceTrack, {
      props: { currentRound, horses, horseProgressList, isRunning: false },
    })
    expect(wrapper.text()).toContain('FINISH')
  })

  it('renders empty lanes when currentRound is null', () => {
    const wrapper = mount(RaceTrack, {
      props: { currentRound: null, horses, horseProgressList: [], isRunning: false },
    })
    expect(wrapper.findAll('svg').length).toBe(0)
  })

  it('defaults progress to 0 when a horseId has no matching progress entry', () => {
    const wrapper = mount(RaceTrack, {
      props: {
        currentRound:      currentRound,
        horses,
        horseProgressList: [], // no progress entries for any horse
        isRunning:         false,
      },
    })
    // Horses render but at position 0
    expect(wrapper.findAll('svg').length).toBeGreaterThan(0)
  })

  it('renders zero-id lanes (placeholder) without horse sprites', () => {
    const roundWithZeros: RoundSchedule = {
      spec:     ROUND_SPECS[0],
      horseIds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    const wrapper = mount(RaceTrack, {
      props: { currentRound: roundWithZeros, horses, horseProgressList: [], isRunning: false },
    })
    expect(wrapper.findAll('svg').length).toBe(0)
  })
})
