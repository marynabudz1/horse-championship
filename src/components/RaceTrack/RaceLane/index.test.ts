import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceLane from './index'
import type { Horse } from '~/types/horse'

const horse: Horse = { id: 1, name: 'Thunder', condition: 85, color: '#e74c3c' }

describe('RaceLane', () => {
  it('renders the lane number', () => {
    const wrapper = mount(RaceLane, {
      props: { laneNumber: 3, horse, progress: 0 },
    })
    expect(wrapper.text()).toContain('3')
  })

  it('renders a HorseSprite when horse is provided', () => {
    const wrapper = mount(RaceLane, {
      props: { laneNumber: 1, horse, progress: 0.5 },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('does not render a HorseSprite when horse is undefined', () => {
    const wrapper = mount(RaceLane, {
      props: { laneNumber: 1, horse: undefined, progress: 0 },
    })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('passes isRunning to HorseSprite', () => {
    const wrapper = mount(RaceLane, {
      props: { laneNumber: 1, horse, progress: 0.5, isRunning: true },
    })
    // isRunning=true + progress<1 → gallop animation on inner animation div
    const animationDiv = wrapper.findAll('div').find(
      (d) => d.attributes('style')?.includes('gallop'),
    )
    expect(animationDiv).toBeDefined()
  })

  it('defaults progress to 0', () => {
    const wrapper = mount(RaceLane, {
      props: { laneNumber: 1 },
    })
    expect(wrapper.find('svg').exists()).toBe(false)
  })
})
