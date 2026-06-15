import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore }                  from '~/store'
import { useRaceAnimation }          from '~/composables/useRaceAnimation'
import { RaceStatus }                from '~/types/race'
import { HorseActions, RaceActions } from '~/store/actionTypes'
import type { RoundResult }          from '~/types/race'
import HorseList                     from '~/components/HorseList'
import RaceTrack                     from '~/components/RaceTrack'
import ProgramPanel                  from '~/components/Program'
import ResultsPanel                  from '~/components/Results'
import AppButton                     from '~/components/ui/AppButton'
import TabButton                     from '~/components/ui/TabButton'

enum MobileTab {
  Horses  = 'horses',
  Track   = 'track',
  Program = 'program',
  Results = 'results',
}

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: MobileTab.Horses,  label: '🐎 Horses'  },
  { id: MobileTab.Track,   label: '🏁 Track'   },
  { id: MobileTab.Program, label: '📋 Program' },
  { id: MobileTab.Results, label: '🏆 Results' },
]

export default defineComponent({
  name: 'HomeView',
  setup() {
    const store = useStore()
    const { horseProgressList, startAnimation, pauseAnimation, resumeAnimation, stopAnimation } =
      useRaceAnimation()

    const activeMobileTab  = ref<MobileTab>(MobileTab.Track)
    const isLoadingHorses  = ref(false)
    const initError        = ref<string | null>(null)

    const horses            = computed(() => store.state.horses.horses)
    const schedule          = computed(() => store.state.race.schedule)
    const completedRounds   = computed(() => store.state.race.completedRounds)
    const currentRoundIndex = computed(() => store.state.race.currentRoundIndex)
    const raceStatus        = computed(() => store.state.race.status)

    const currentRound = computed(() => {
      if (schedule.value.length === 0) return null
      if (currentRoundIndex.value >= schedule.value.length) return null
      return schedule.value[currentRoundIndex.value] ?? null
    })

    const startPauseLabel = computed(() =>
      raceStatus.value === RaceStatus.Running ? 'PAUSE' : 'START',
    )

    const isStartPauseDisabled = computed(
      () => schedule.value.length === 0 || raceStatus.value === RaceStatus.Finished,
    )

    onMounted(async () => {
      if (horses.value.length === 0) {
        isLoadingHorses.value = true
        try {
          await store.dispatch(HorseActions.INIT_HORSES)
        } catch (err) {
          initError.value = err instanceof Error ? err.message : 'Failed to load horses.'
        } finally {
          isLoadingHorses.value = false
        }
      }
    })

    function handleGenerateProgram(): void {
      stopAnimation()
      store.dispatch(RaceActions.RESET_RACE).then(() => {
        const ensureHorsesThen = (callback: () => void) => {
          if (horses.value.length === 0) {
            store.dispatch(HorseActions.INIT_HORSES).then(callback)
          } else {
            callback()
          }
        }
        ensureHorsesThen(() => store.dispatch(RaceActions.GENERATE_PROGRAM))
      })
    }

    function handleRoundComplete(results: RoundResult[]): void {
      store.dispatch(RaceActions.COMPLETE_ROUND, results).then(() => {
        const isLastRound = currentRoundIndex.value + 1 >= schedule.value.length

        if (isLastRound) {
          store.dispatch(RaceActions.SET_STATUS, RaceStatus.Finished)
        } else {
          store.dispatch(RaceActions.ADVANCE_ROUND).then(() => {
            store.dispatch(RaceActions.SET_STATUS, RaceStatus.Idle)
          })
        }

        activeMobileTab.value = MobileTab.Results
      })
    }

    function handleStartPause(): void {
      const currentStatus = raceStatus.value

      if (currentStatus === RaceStatus.Idle) {
        const round = currentRound.value
        if (!round) return
        store.dispatch(RaceActions.SET_STATUS, RaceStatus.Running)
        startAnimation(round, horses.value, handleRoundComplete)
      } else if (currentStatus === RaceStatus.Running) {
        store.dispatch(RaceActions.SET_STATUS, RaceStatus.Paused)
        pauseAnimation()
      } else if (currentStatus === RaceStatus.Paused) {
        store.dispatch(RaceActions.SET_STATUS, RaceStatus.Running)
        resumeAnimation()
      }
    }

    return () => (
      <div class="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">

        <header class="flex items-center justify-between flex-shrink-0 px-3 py-2 md:py-2.5 bg-[#e85d5d] shadow-md min-h-[48px]">
          <h1 class="text-white font-bold text-base md:text-xl whitespace-nowrap">
            🐎 <span class="hidden xs:inline">Horse Racing</span>
            <span class="xs:hidden">HR</span>
          </h1>

          <div class="flex items-center gap-1.5 md:gap-2">
            <div class="relative group">
              <AppButton label="GENERATE PROGRAM" variant="secondary" disabled={isLoadingHorses.value} onClick={handleGenerateProgram} />
              <div class="
                hidden md:block absolute right-0 top-full mt-2 w-64 z-50
                bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg
                opacity-0 pointer-events-none
                group-hover:opacity-100 group-hover:pointer-events-auto
                transition-opacity duration-200
              ">
                <p class="font-bold mb-1">Generate Race Program</p>
                <p class="text-gray-300 leading-relaxed">
                  Randomly selects <span class="text-white font-semibold">10 horses</span> per
                  round and builds a{' '}
                  <span class="text-white font-semibold">6-round schedule</span>{' '}
                  (1200 m → 2200 m). Resets any ongoing race and results.
                </p>
              </div>
            </div>

            <AppButton
              label={startPauseLabel.value}
              variant="secondary"
              disabled={isStartPauseDisabled.value || isLoadingHorses.value}
              onClick={handleStartPause}
            />
          </div>
        </header>

        {/* Desktop */}
        <main class="hidden md:flex flex-1 overflow-hidden p-2 gap-2 min-h-0">
          <div class="w-[220px] min-w-[220px] flex-shrink-0 overflow-hidden relative">
            {isLoadingHorses.value
              ? <div class="flex items-center justify-center h-full text-gray-400 text-sm">Loading horses…</div>
              : initError.value
                ? <div class="flex items-center justify-center h-full text-red-500 text-sm p-4 text-center">{initError.value}</div>
                : <HorseList horses={horses.value} />
            }
          </div>
          <div class="flex-1 min-w-0 overflow-hidden">
            <RaceTrack
              currentRound={currentRound.value}
              horses={horses.value}
              horseProgressList={horseProgressList.value}
              isRunning={raceStatus.value === RaceStatus.Running}
            />
          </div>
          <div class="w-[400px] min-w-[400px] flex-shrink-0 flex gap-2 overflow-hidden">
            <div class="flex-1 min-w-0 overflow-hidden">
              <ProgramPanel schedule={schedule.value} horses={horses.value} />
            </div>
            <div class="flex-1 min-w-0 overflow-hidden">
              <ResultsPanel
                completedRounds={completedRounds.value}
                schedule={schedule.value}
                horses={horses.value}
              />
            </div>
          </div>
        </main>

        {/* Mobile */}
        <div class="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
          <nav class="flex flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
            {MOBILE_TABS.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                isActive={activeMobileTab.value === tab.id}
                onClick={() => { activeMobileTab.value = tab.id }}
              />
            ))}
          </nav>

          <div class="flex-1 overflow-hidden min-h-0 p-2">
            {activeMobileTab.value === MobileTab.Horses && (
              <div class="h-full overflow-hidden">
                {isLoadingHorses.value
                  ? <div class="flex items-center justify-center h-full text-gray-400 text-sm">Loading horses…</div>
                  : initError.value
                    ? <div class="flex items-center justify-center h-full text-red-500 text-sm p-4 text-center">{initError.value}</div>
                    : <HorseList horses={horses.value} />
                }
              </div>
            )}
            {activeMobileTab.value === MobileTab.Track && (
              <div class="h-full overflow-hidden">
                <RaceTrack
                  currentRound={currentRound.value}
                  horses={horses.value}
                  horseProgressList={horseProgressList.value}
                  isRunning={raceStatus.value === RaceStatus.Running}
                />
              </div>
            )}
            {activeMobileTab.value === MobileTab.Program && (
              <div class="h-full overflow-hidden">
                <ProgramPanel schedule={schedule.value} horses={horses.value} />
              </div>
            )}
            {activeMobileTab.value === MobileTab.Results && (
              <div class="h-full overflow-hidden">
                <ResultsPanel
                  completedRounds={completedRounds.value}
                  schedule={schedule.value}
                  horses={horses.value}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
})
