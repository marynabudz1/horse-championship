import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgramPanel from './index'
import type { Horse } from '~/types/horse'
import type { RoundSchedule } from '~/types/race'
import { ROUND_SPECS } from '~/constants/race'

const horses: Horse[] = [
  { id: 1, name: 'Thunder', condition: 85, color: '#e74c3c' },
  { id: 2, name: 'Storm',   condition: 72, color: '#3498db' },
]

const schedule: RoundSchedule[] = [
  { spec: ROUND_SPECS[0], horseIds: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2] },
  { spec: ROUND_SPECS[1], horseIds: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1] },
]

describe('ProgramPanel', () => {
  it('shows empty state message when schedule is empty', () => {
    const wrapper = mount(ProgramPanel, {
      props: { schedule: [], horses },
    })
    expect(wrapper.text()).toContain('No program generated yet')
  })

  it('renders a section per round when schedule has rounds', () => {
    const wrapper = mount(ProgramPanel, {
      props: { schedule, horses },
    })
    expect(wrapper.text()).toContain(ROUND_SPECS[0].label)
    expect(wrapper.text()).toContain(ROUND_SPECS[1].label)
  })

  it('renders horse names in each round', () => {
    const wrapper = mount(ProgramPanel, {
      props: { schedule, horses },
    })
    expect(wrapper.text()).toContain('Thunder')
    expect(wrapper.text()).toContain('Storm')
  })

  it('falls back to "Horse N" when horse id is not found', () => {
    const scheduleWithUnknown: RoundSchedule[] = [
      { spec: ROUND_SPECS[0], horseIds: [99, 1, 2, 1, 2, 1, 2, 1, 2, 1] },
    ]
    const wrapper = mount(ProgramPanel, {
      props: { schedule: scheduleWithUnknown, horses },
    })
    expect(wrapper.text()).toContain('Horse 99')
  })

  it('renders the panel header', () => {
    const wrapper = mount(ProgramPanel, {
      props: { schedule: [], horses },
    })
    expect(wrapper.text()).toContain('Program')
  })
})
