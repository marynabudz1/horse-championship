import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsPanel from './index'
import type { Horse } from '~/types/horse'
import type { RoundSchedule, CompletedRound } from '~/types/race'
import { ROUND_SPECS } from '~/constants/race'

const horses: Horse[] = [
  { id: 1, name: 'Thunder', condition: 85, color: '#e74c3c' },
  { id: 2, name: 'Storm',   condition: 72, color: '#3498db' },
]

const schedule: RoundSchedule[] = [
  { spec: ROUND_SPECS[0], horseIds: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2] },
  { spec: ROUND_SPECS[1], horseIds: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1] },
]

const completedRounds: CompletedRound[] = [
  {
    roundIndex: 0,
    results:    [{ position: 1, horseId: 1 }, { position: 2, horseId: 2 }],
  },
  {
    roundIndex: 1,
    results:    [{ position: 1, horseId: 2 }, { position: 2, horseId: 1 }],
  },
]

describe('ResultsPanel', () => {
  it('shows empty state message when no results', () => {
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds: [], schedule, horses },
    })
    expect(wrapper.text()).toContain('No results yet')
  })

  it('renders completed round labels', () => {
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds, schedule, horses },
    })
    expect(wrapper.text()).toContain(ROUND_SPECS[0].label)
    expect(wrapper.text()).toContain(ROUND_SPECS[1].label)
  })

  it('renders horse names in results', () => {
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds, schedule, horses },
    })
    expect(wrapper.text()).toContain('Thunder')
    expect(wrapper.text()).toContain('Storm')
  })

  it('falls back to "Horse N" when horse not found', () => {
    const roundsWithUnknown: CompletedRound[] = [
      { roundIndex: 0, results: [{ position: 1, horseId: 99 }] },
    ]
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds: roundsWithUnknown, schedule, horses },
    })
    expect(wrapper.text()).toContain('Horse 99')
  })

  it('falls back to "Round N" label when schedule index not found', () => {
    const roundsOutOfBounds: CompletedRound[] = [
      { roundIndex: 10, results: [{ position: 1, horseId: 1 }] },
    ]
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds: roundsOutOfBounds, schedule, horses },
    })
    expect(wrapper.text()).toContain('Round 11')
  })

  it('renders the panel header', () => {
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds: [], schedule, horses },
    })
    expect(wrapper.text()).toContain('Results')
  })

  it('renders position numbers', () => {
    const wrapper = mount(ResultsPanel, {
      props: { completedRounds, schedule, horses },
    })
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })
})
