import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TabButton from './index'

describe('TabButton', () => {
  it('renders the label text', () => {
    const wrapper = mount(TabButton, {
      props: { label: '🐎 Horses', onClick: vi.fn() },
    })
    expect(wrapper.text()).toContain('Horses')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(TabButton, {
      props: { label: 'Tab', onClick },
    })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies active styles when isActive is true', () => {
    const wrapper = mount(TabButton, {
      props: { label: 'Tab', isActive: true, onClick: vi.fn() },
    })
    const cls = wrapper.find('button').classes().join(' ')
    expect(cls).toContain('border-b-2')
  })

  it('applies inactive styles when isActive is false', () => {
    const wrapper = mount(TabButton, {
      props: { label: 'Tab', isActive: false, onClick: vi.fn() },
    })
    const cls = wrapper.find('button').classes().join(' ')
    expect(cls).toContain('text-gray-500')
  })

  it('defaults isActive to false', () => {
    const wrapper = mount(TabButton, {
      props: { label: 'Tab', onClick: vi.fn() },
    })
    const cls = wrapper.find('button').classes().join(' ')
    expect(cls).toContain('text-gray-500')
  })
})
