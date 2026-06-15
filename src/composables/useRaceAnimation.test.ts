import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useRaceAnimation } from './useRaceAnimation'
import type { Horse } from '~/types/horse'
import type { RoundSchedule } from '~/types/race'
import { ROUND_SPECS } from '~/constants/race'

const horses: Horse[] = Array.from({ length: 10 }, (_, i) => ({
  id:        i + 1,
  name:      `Horse ${i + 1}`,
  condition: 80,
  color:     '#ff0000',
}))

const round: RoundSchedule = {
  spec:     ROUND_SPECS[0],
  horseIds: horses.map((h) => h.id),
}

describe('useRaceAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    let frameId = 0
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frameId++
      setTimeout(() => cb(performance.now()), 16)
      return frameId
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('performance', { now: vi.fn(() => Date.now()) })
  })

  it('initialises horseProgressList as empty', () => {
    const { horseProgressList } = useRaceAnimation()
    expect(horseProgressList.value).toEqual([])
  })

  it('startAnimation populates horseProgressList with one entry per horse', () => {
    const { horseProgressList, startAnimation, stopAnimation } = useRaceAnimation()
    startAnimation(round, horses, vi.fn())
    expect(horseProgressList.value.length).toBe(10)
    stopAnimation()
  })

  it('stopAnimation cancels RAF and clears state', () => {
    const { startAnimation, stopAnimation } = useRaceAnimation()
    startAnimation(round, horses, vi.fn())
    stopAnimation()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  it('pauseAnimation calls cancelAnimationFrame', () => {
    const { startAnimation, pauseAnimation, stopAnimation } = useRaceAnimation()
    startAnimation(round, horses, vi.fn())
    pauseAnimation()
    expect(cancelAnimationFrame).toHaveBeenCalled()
    stopAnimation()
  })

  it('pauseAnimation is a no-op if not running', () => {
    const { pauseAnimation } = useRaceAnimation()
    expect(() => pauseAnimation()).not.toThrow()
  })

  it('resumeAnimation after pause schedules a new RAF', () => {
    const rafSpy = vi.fn().mockReturnValue(1)
    vi.stubGlobal('requestAnimationFrame', rafSpy)
    const { startAnimation, pauseAnimation, resumeAnimation, stopAnimation } = useRaceAnimation()
    startAnimation(round, horses, vi.fn())
    pauseAnimation()
    const callsBefore = rafSpy.mock.calls.length
    resumeAnimation()
    expect(rafSpy.mock.calls.length).toBeGreaterThan(callsBefore)
    stopAnimation()
  })

  it('resumeAnimation is a no-op if not paused', () => {
    const { resumeAnimation } = useRaceAnimation()
    expect(() => resumeAnimation()).not.toThrow()
  })

  it('handles horses not found in horses array (uses condition 50 fallback)', () => {
    const { horseProgressList, startAnimation, stopAnimation } = useRaceAnimation()
    // round references horseId 99 which is not in the horses array
    const roundWithUnknown: RoundSchedule = {
      spec:     ROUND_SPECS[0],
      horseIds: [99, ...horses.slice(1).map((h) => h.id)],
    }
    startAnimation(roundWithUnknown, horses, vi.fn())
    expect(horseProgressList.value.length).toBe(10)
    stopAnimation()
  })

  it('all horses start at progress 0', () => {
    const { horseProgressList, startAnimation, stopAnimation } = useRaceAnimation()
    startAnimation(round, horses, vi.fn())
    expect(horseProgressList.value.every((hp) => hp.progress === 0)).toBe(true)
    stopAnimation()
  })

  it('startAnimation called again stops prior animation and resets', () => {
    const { horseProgressList, startAnimation, stopAnimation } = useRaceAnimation()
    startAnimation(round, horses, vi.fn())
    startAnimation(round, horses, vi.fn())
    expect(horseProgressList.value.length).toBe(10)
    stopAnimation()
  })

  it('cancels RAF via onUnmounted when the host component is destroyed', () => {
    const cancelSpy = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancelSpy)

    const TestComponent = defineComponent({
      setup() {
        const { startAnimation } = useRaceAnimation()
        startAnimation(round, horses, vi.fn())
        return () => null
      },
    })

    const wrapper = mount(TestComponent)
    wrapper.unmount()

    expect(cancelSpy).toHaveBeenCalled()
  })

  it('completes race and calls onComplete after all horses finish', async () => {
    const onComplete = vi.fn()
    // Use a real-ish timer but fast-forward: stub RAF to run immediately
    let callCount = 0
    const maxCalls = 200
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      if (callCount++ < maxCalls) setTimeout(() => cb(performance.now() + callCount * 100), 0)
      return callCount
    })
    vi.stubGlobal('performance', { now: vi.fn(() => callCount * 100) })

    const { startAnimation } = useRaceAnimation()
    startAnimation(round, horses, onComplete)

    await vi.runAllTimersAsync()
    expect(onComplete).toHaveBeenCalledTimes(1)
    const results = onComplete.mock.calls[0][0] as { position: number; horseId: number }[]
    expect(results.length).toBe(10)
    expect(results[0].position).toBe(1)
  })
})
