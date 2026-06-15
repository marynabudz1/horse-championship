import { describe, it, expect, vi }            from 'vitest'
import { defineComponent, h, onMounted, nextTick } from 'vue'
import { mount }                                from '@vue/test-utils'
import ErrorBoundary                            from './index'

/**
 * A child that throws inside onMounted — errors from lifecycle hooks
 * are reliably propagated to onErrorCaptured in the parent.
 */
const ThrowingChild = defineComponent({
  setup() {
    onMounted(() => { throw new Error('Test lifecycle error') })
  },
  render() { return h('div', 'child') },
})

/** A child that renders and mounts without issue */
const GoodChild = defineComponent({
  render() { return h('p', 'All good') },
})

describe('ErrorBoundary', () => {
  it('renders slot content when there is no error', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: GoodChild },
    })
    expect(wrapper.text()).toContain('All good')
    expect(wrapper.text()).not.toContain('Something went wrong')
  })

  it('renders the error UI when a child lifecycle hook throws', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const wrapper = mount(ErrorBoundary, {
      slots: { default: ThrowingChild },
    })

    await nextTick()

    expect(wrapper.text()).toContain('Something went wrong')
    expect(wrapper.text()).toContain('Test lifecycle error')
    expect(wrapper.find('button').text()).toBe('Try Again')
  })

  it('clears the error state when Try Again is clicked', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    // Child that throws only on the first mount, recovers on retry
    let mountCount = 0
    const ThrowsOnce = defineComponent({
      setup() {
        onMounted(() => {
          mountCount++
          if (mountCount === 1) throw new Error('First mount error')
        })
      },
      render() { return h('p', 'Recovered') },
    })

    const wrapper = mount(ErrorBoundary, {
      slots: { default: ThrowsOnce },
    })

    await nextTick()
    expect(wrapper.text()).toContain('Something went wrong')

    await wrapper.find('button').trigger('click')
    await nextTick()

    // Second mount succeeds — error UI should be gone and slot renders
    expect(wrapper.text()).not.toContain('Something went wrong')
    expect(wrapper.text()).toContain('Recovered')
  })

  it('shows the generic fallback message when error has no message', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const ThrowsEmptyError = defineComponent({
      setup() {
        onMounted(() => { throw new Error('') })
      },
      render() { return h('div') },
    })

    const wrapper = mount(ErrorBoundary, {
      slots: { default: ThrowsEmptyError },
    })

    await nextTick()
    expect(wrapper.text()).toContain('An unexpected error occurred.')
  })

  it('handles non-Error thrown values by stringifying them', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const ThrowingString = defineComponent({
      setup() {
        onMounted(() => { throw 'plain string error' })
      },
      render() { return h('div') },
    })

    const wrapper = mount(ErrorBoundary, {
      slots: { default: ThrowingString },
    })

    await nextTick()
    expect(wrapper.text()).toContain('plain string error')
  })
})
