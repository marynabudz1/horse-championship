import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPanel from './index'

describe('AppPanel', () => {
  it('renders the title', () => {
    const wrapper = mount(AppPanel, {
      props: { title: 'My Panel' },
    })
    expect(wrapper.text()).toContain('My Panel')
  })

  it('applies default headerClass', () => {
    const wrapper = mount(AppPanel, {
      props: { title: 'Panel' },
    })
    expect(wrapper.html()).toContain('bg-gray-700')
  })

  it('applies custom headerClass', () => {
    const wrapper = mount(AppPanel, {
      props: { title: 'Panel', headerClass: 'bg-blue-700 text-white' },
    })
    expect(wrapper.html()).toContain('bg-blue-700')
  })

  it('renders default slot content', () => {
    const wrapper = mount(AppPanel, {
      props: { title: 'Panel' },
      slots: { default: '<p>Slot content</p>' },
    })
    expect(wrapper.text()).toContain('Slot content')
  })

  it('renders without slot content', () => {
    const wrapper = mount(AppPanel, {
      props: { title: 'Empty Panel' },
    })
    expect(wrapper.text()).toContain('Empty Panel')
  })
})
