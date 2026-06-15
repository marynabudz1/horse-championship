import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollTable from './index'

const COLUMNS = ['Name', 'Score', 'Color']
const ROWS    = [
  ['Alpha', '90', '#ff0000'],
  ['Beta',  '80', '#00ff00'],
]

describe('ScrollTable', () => {
  it('renders all column headers', () => {
    const wrapper = mount(ScrollTable, {
      props: { columns: COLUMNS, rows: ROWS },
    })
    COLUMNS.forEach((col) => expect(wrapper.text()).toContain(col))
  })

  it('renders all row data', () => {
    const wrapper = mount(ScrollTable, {
      props: { columns: COLUMNS, rows: ROWS },
    })
    expect(wrapper.text()).toContain('Alpha')
    expect(wrapper.text()).toContain('Beta')
    expect(wrapper.text()).toContain('90')
    expect(wrapper.text()).toContain('80')
  })

  it('renders a swatch span instead of text for swatchColumn', () => {
    const wrapper = mount(ScrollTable, {
      props: { columns: COLUMNS, rows: ROWS, swatchColumn: 2 },
    })
    const swatches = wrapper.findAll('span.inline-block')
    expect(swatches.length).toBe(2)
    // jsdom converts hex to rgb notation
    expect(swatches[0].attributes('style')).toContain('255, 0, 0')
  })

  it('does not render swatch when swatchColumn is -1 (default)', () => {
    const wrapper = mount(ScrollTable, {
      props: { columns: COLUMNS, rows: ROWS },
    })
    expect(wrapper.findAll('span.inline-block').length).toBe(0)
    expect(wrapper.text()).toContain('#ff0000')
  })

  it('applies custom headerClass', () => {
    const wrapper = mount(ScrollTable, {
      props: { columns: COLUMNS, rows: ROWS, headerClass: 'bg-yellow-100' },
    })
    expect(wrapper.find('thead').classes()).toContain('bg-yellow-100')
  })

  it('applies even and odd row classes alternately', () => {
    const wrapper = mount(ScrollTable, {
      props: {
        columns:      COLUMNS,
        rows:         ROWS,
        evenRowClass: 'bg-white',
        oddRowClass:  'bg-gray-50',
      },
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].classes()).toContain('bg-white')
    expect(rows[1].classes()).toContain('bg-gray-50')
  })

  it('renders an empty table when rows is empty', () => {
    const wrapper = mount(ScrollTable, {
      props: { columns: COLUMNS, rows: [] },
    })
    expect(wrapper.findAll('tbody tr').length).toBe(0)
  })
})
