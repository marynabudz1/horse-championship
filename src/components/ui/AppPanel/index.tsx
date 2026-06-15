import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'AppPanel',
  props: {
    title: {
      type: String as PropType<string>,
      required: true,
    },
    headerClass: {
      type: String as PropType<string>,
      default: 'bg-gray-700 text-white',
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col h-full border border-gray-300 overflow-hidden">
        <div class={`px-3 py-2 font-bold text-sm uppercase tracking-wider ${props.headerClass}`}>
          {props.title}
        </div>
        <div class="flex-1 overflow-hidden">{slots.default?.()}</div>
      </div>
    )
  },
})
