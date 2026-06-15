import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { HorseProgress, RoundSchedule, RoundResult } from '~/types/race'
import type { Horse } from '~/types/horse'
import { ANIMATION_BASE_MS, ANIMATION_MIN_CONDITION } from '~/constants/race'

/** In E2E test mode races complete in ~1 second instead of ~40 seconds */
const EFFECTIVE_BASE_MS = import.meta.env.VITE_E2E_FAST_ANIMATION === 'true'
  ? 80
  : ANIMATION_BASE_MS

interface AnimationState {
  rafId:             number | null
  startTime:         number
  pausedAt:          number | null
  pauseOffset:       number
  durationByHorseId: Map<number, number>
  onComplete:        ((results: RoundResult[]) => void) | null
}

export function useRaceAnimation() {
  const horseProgressList: Ref<HorseProgress[]> = ref([])

  const animationState: AnimationState = {
    rafId:             null,
    startTime:         0,
    pausedAt:          null,
    pauseOffset:       0,
    durationByHorseId: new Map(),
    onComplete:        null,
  }

  function buildHorseDurations(round: RoundSchedule, horses: Horse[]): Map<number, number> {
    const durationMap = new Map<number, number>()
    round.horseIds.forEach((horseId) => {
      const horse            = horses.find((entry) => entry.id === horseId)
      const rawCondition     = horse ? horse.condition : 50
      const effectiveCondition = Math.max(rawCondition, ANIMATION_MIN_CONDITION)
      const duration =
        EFFECTIVE_BASE_MS *
        (round.spec.distance / 1200) *
        (100 / effectiveCondition) *
        (0.92 + Math.random() * 0.16)
      durationMap.set(horseId, duration)
    })
    return durationMap
  }

  function buildResults(finishedProgressList: HorseProgress[]): RoundResult[] {
    return [...finishedProgressList]
      .sort((a, b) => (a.finishTime ?? Infinity) - (b.finishTime ?? Infinity))
      .map((horseProgress, rankIndex) => ({
        position: rankIndex + 1,
        horseId:  horseProgress.horseId,
      }))
  }

  function advanceFrame(timestamp: number): void {
    const elapsed = timestamp - animationState.startTime + animationState.pauseOffset
    let allFinished = true

    horseProgressList.value = horseProgressList.value.map((horseProgress) => {
      if (horseProgress.finished) return horseProgress

      const duration   = animationState.durationByHorseId.get(horseProgress.horseId) ?? ANIMATION_BASE_MS
      const progress   = Math.min(elapsed / duration, 1)
      const finished   = progress >= 1
      const finishTime = finished && horseProgress.finishTime === null ? timestamp : horseProgress.finishTime

      if (!finished) allFinished = false
      return { ...horseProgress, progress, finished, finishTime }
    })

    if (allFinished) {
      animationState.rafId = null
      if (animationState.onComplete) {
        animationState.onComplete(buildResults(horseProgressList.value))
        animationState.onComplete = null
      }
      return
    }

    animationState.rafId = requestAnimationFrame(advanceFrame)
  }

  function startAnimation(
    round: RoundSchedule,
    horses: Horse[],
    onRoundComplete: (results: RoundResult[]) => void,
  ): void {
    stopAnimation()

    animationState.onComplete        = onRoundComplete
    animationState.pausedAt          = null
    animationState.pauseOffset       = 0
    animationState.durationByHorseId = buildHorseDurations(round, horses)

    horseProgressList.value = round.horseIds.map((horseId, laneIndex) => ({
      horseId,
      progress:   0,
      finished:   false,
      finishTime: null,
      lane:       laneIndex,
    }))

    animationState.startTime = performance.now()
    animationState.rafId     = requestAnimationFrame(advanceFrame)
  }

  function pauseAnimation(): void {
    if (animationState.rafId !== null) {
      cancelAnimationFrame(animationState.rafId)
      animationState.rafId    = null
      animationState.pausedAt = performance.now()
    }
  }

  function resumeAnimation(): void {
    if (animationState.pausedAt !== null) {
      animationState.pauseOffset += animationState.pausedAt - animationState.startTime
      animationState.startTime    = performance.now()
      animationState.pausedAt     = null
      animationState.rafId        = requestAnimationFrame(advanceFrame)
    }
  }

  function stopAnimation(): void {
    if (animationState.rafId !== null) {
      cancelAnimationFrame(animationState.rafId)
      animationState.rafId = null
    }
    animationState.pausedAt    = null
    animationState.pauseOffset = 0
    animationState.onComplete  = null
  }

  // Cancel any in-flight RAF when the component that owns this composable unmounts
  onUnmounted(() => stopAnimation())

  return { horseProgressList, startAnimation, pauseAnimation, resumeAnimation, stopAnimation }
}
