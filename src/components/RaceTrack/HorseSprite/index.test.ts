import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseSprite from './index'

describe('HorseSprite', () => {
  it('renders an svg element', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 0, laneIndex: 0 },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies the horse color to the svg path fill', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 0, laneIndex: 0 },
    })
    expect(wrapper.find('path').attributes('fill')).toBe('#ff0000')
  })

  it('positions horse at 0% when progress is 0', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 0, laneIndex: 0 },
    })
    const outer = wrapper.find('div')
    expect(outer.attributes('style')).toContain('left: calc(0%)')
  })

  it('positions horse at 88% when progress is 1', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 1, laneIndex: 0 },
    })
    const outer = wrapper.find('div')
    expect(outer.attributes('style')).toContain('left: calc(88%)')
  })

  it('caps position at 88% for progress > 1', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 2, laneIndex: 0 },
    })
    expect(wrapper.find('div').attributes('style')).toContain('left: calc(88%)')
  })

  it('enables gallop animation when isRunning and progress < 1', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 0.5, laneIndex: 0, isRunning: true },
    })
    // findAll('div')[1] is the inner animation div (index 0 is outer positioning div)
    const inner = wrapper.findAll('div')[1]
    expect(inner.attributes('style')).toContain('gallop')
  })

  it('disables gallop animation when not running', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 0.5, laneIndex: 0, isRunning: false },
    })
    const inner = wrapper.findAll('div')[1]
    expect(inner.attributes('style')).toContain('none')
  })

  it('disables gallop animation when progress is 1 (finished)', () => {
    const wrapper = mount(HorseSprite, {
      props: { color: '#ff0000', progress: 1, laneIndex: 0, isRunning: true },
    })
    const inner = wrapper.findAll('div')[1]
    expect(inner.attributes('style')).toContain('none')
  })
})
