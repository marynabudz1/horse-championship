import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './index'

describe('AppButton', () => {
  it('renders the label text', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'CLICK ME', onClick: vi.fn() },
    })
    expect(wrapper.text()).toBe('CLICK ME')
  })

  it('renders a <button> element', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'TEST', onClick: vi.fn() },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(AppButton, {
      props: { label: 'BTN', onClick },
    })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies secondary variant classes', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'BTN', variant: 'secondary', onClick: vi.fn() },
    })
    expect(wrapper.find('button').classes().join(' ')).toContain('bg-transparent')
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'BTN', onClick: vi.fn() },
    })
    expect(wrapper.find('button').classes().join(' ')).toContain('bg-white')
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'BTN', disabled: true, onClick: vi.fn() },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('is not disabled by default', () => {
    const wrapper = mount(AppButton, {
      props: { label: 'BTN', onClick: vi.fn() },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })
})
