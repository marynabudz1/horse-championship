import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseList from './index'
import type { Horse } from '~/types/horse'

const horses: Horse[] = [
  { id: 1, name: 'Thunder', condition: 85, color: '#e74c3c' },
  { id: 2, name: 'Storm',   condition: 72, color: '#3498db' },
]

describe('HorseList', () => {
  it('renders the panel title with horse count', () => {
    const wrapper = mount(HorseList, { props: { horses } })
    expect(wrapper.text()).toContain('Horse List (2)')
  })

  it('renders all horse names', () => {
    const wrapper = mount(HorseList, { props: { horses } })
    expect(wrapper.text()).toContain('Thunder')
    expect(wrapper.text()).toContain('Storm')
  })

  it('renders horse condition scores', () => {
    const wrapper = mount(HorseList, { props: { horses } })
    expect(wrapper.text()).toContain('85')
    expect(wrapper.text()).toContain('72')
  })

  it('renders color swatches for each horse', () => {
    const wrapper = mount(HorseList, { props: { horses } })
    const swatches = wrapper.findAll('span.inline-block')
    expect(swatches.length).toBe(2)
  })

  it('renders column headers', () => {
    const wrapper = mount(HorseList, { props: { horses } })
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Cond.')
  })

  it('renders empty table when no horses', () => {
    const wrapper = mount(HorseList, { props: { horses: [] } })
    expect(wrapper.findAll('tbody tr').length).toBe(0)
  })
})
