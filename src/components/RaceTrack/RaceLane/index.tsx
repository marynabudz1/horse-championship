import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Horse } from '~/types/horse'
import HorseSprite from '~/components/RaceTrack/HorseSprite'

export default defineComponent({
  name: 'RaceLane',
  props: {
    laneNumber: { type: Number  as PropType<number>,            required: true },
    horse:      { type: Object  as PropType<Horse | undefined>, default: undefined },
    progress:   { type: Number  as PropType<number>,            default: 0 },
    isRunning:  { type: Boolean as PropType<boolean>,           default: false },
  },
  setup(props) {
    return () => (
      <div class="flex h-[52px] border-b border-dashed border-white/30 relative overflow-hidden">

        {/* Lane number strip */}
        <div class="
          w-8 min-w-[2rem] flex-shrink-0
          flex items-center justify-center
          bg-[#1a4a1a] border-r-2 border-[#0d2b0d]
          text-white text-[13px] font-bold z-[5]
        ">
          {props.laneNumber}
        </div>

        {/* Track surface */}
        <div class="flex-1 bg-[#2d7a2d] relative overflow-hidden">
          <div class="absolute inset-x-0 top-1/2 h-px bg-white/5" />
          {props.horse && (
            <HorseSprite
              color={props.horse.color}
              progress={props.progress}
              laneIndex={props.laneNumber - 1}
              isRunning={props.isRunning}
            />
          )}
        </div>
      </div>
    )
  },
})
