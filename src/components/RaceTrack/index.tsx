import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { Horse } from '~/types/horse'
import type { RoundSchedule, HorseProgress } from '~/types/race'
import RaceLane from '~/components/RaceTrack/RaceLane'

const EMPTY_LANE_IDS: number[] = Array(10).fill(0) as number[]

export default defineComponent({
  name: 'RaceTrack',
  props: {
    currentRound:      { type: Object  as PropType<RoundSchedule | null>, default: null },
    horses:            { type: Array   as PropType<Horse[]>,              required: true },
    horseProgressList: { type: Array   as PropType<HorseProgress[]>,      required: true },
    isRunning:         { type: Boolean as PropType<boolean>,              default: false },
  },
  setup(props) {
    const horseById = computed<Map<number, Horse>>(() => {
      const horseMap = new Map<number, Horse>()
      props.horses.forEach((horse) => horseMap.set(horse.id, horse))
      return horseMap
    })

    const progressByHorseId = computed<Map<number, number>>(() => {
      const progressMap = new Map<number, number>()
      props.horseProgressList.forEach((horseProgress) =>
        progressMap.set(horseProgress.horseId, horseProgress.progress),
      )
      return progressMap
    })

    const laneHorseIds = computed<number[]>(() =>
      props.currentRound ? props.currentRound.horseIds : EMPTY_LANE_IDS,
    )

    return () => {
      const roundLabel = props.currentRound
        ? props.currentRound.spec.label
        : 'No race scheduled'

      return (
        <div class="flex flex-col h-full bg-[#1a1a1a] border border-[#333] overflow-hidden min-w-0">

          {/* Track area */}
          <div class="flex-1 relative overflow-hidden">
            <div class="h-full flex flex-col">
              {laneHorseIds.value.map((horseId, laneIndex) => (
                <RaceLane
                  key={laneIndex}
                  laneNumber={laneIndex + 1}
                  horse={horseId ? horseById.value.get(horseId) : undefined}
                  progress={horseId ? (progressByHorseId.value.get(horseId) ?? 0) : 0}
                  isRunning={props.isRunning}
                />
              ))}
            </div>

            {/* Finish line */}
            <div class="absolute top-0 right-8 w-1 h-full bg-red-500 z-20">
              <span class="
                absolute top-1 -left-5
                text-white text-[9px] font-bold tracking-[2px]
                bg-red-500 px-0.5 py-px
                [writing-mode:vertical-rl] [text-orientation:upright]
              ">
                FINISH
              </span>
            </div>
          </div>

          {/* Bottom info bar */}
          <div class="flex items-center justify-between flex-shrink-0 bg-[#111] border-t border-[#333] px-3 py-1.5 text-xs">
            <span class="font-bold text-white">{roundLabel}</span>
            <span class="text-gray-500 font-semibold tracking-widest">FINISH</span>
          </div>
        </div>
      )
    }
  },
})
