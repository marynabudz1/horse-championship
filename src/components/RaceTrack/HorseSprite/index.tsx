import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { HORSE_RUNNING_SVG_PATH, HORSE_RUNNING_SVG_VIEWBOX } from '~/assets/svg/horseRunning'
import { TRACK_FINISH_PERCENT } from '~/constants/race'

export default defineComponent({
  name: 'HorseSprite',
  props: {
    color:     { type: String  as PropType<string>,  required: true },
    progress:  { type: Number  as PropType<number>,  required: true },
    laneIndex: { type: Number  as PropType<number>,  required: true },
    isRunning: { type: Boolean as PropType<boolean>, default: true  },
  },
  setup(props) {
    return () => {
      const leftPercent = Math.min(props.progress * TRACK_FINISH_PERCENT, TRACK_FINISH_PERCENT)
      const isAnimating = props.isRunning && props.progress < 1

      return (
        <div
          class="absolute top-1/2 -translate-y-1/2 z-10 w-[52px] h-[52px]"
          style={{ left: `calc(${leftPercent}%)`, transition: 'left 0.05s linear' }}
        >
          <div style={{ animation: isAnimating ? 'gallop 0.38s ease-in-out infinite' : 'none' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={HORSE_RUNNING_SVG_VIEWBOX}
              width="52"
              height="52"
              class="block"
              aria-hidden="true"
            >
              <path fill={props.color} d={HORSE_RUNNING_SVG_PATH} />
            </svg>
          </div>
        </div>
      )
    }
  },
})
