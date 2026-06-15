import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'TabButton',
  props: {
    label:    { type: String  as PropType<string>,  required: true },
    isActive: { type: Boolean as PropType<boolean>, default: false },
    onClick:  { type: Function as PropType<() => void>, required: true },
  },
  setup(props) {
    return () => (
      <button
        onClick={props.onClick}
        class={[
          'flex-1 py-2.5 text-xs font-semibold tracking-wide transition-colors',
          props.isActive
            ? 'text-[#e85d5d] border-b-2 border-[#e85d5d] bg-red-50'
            : 'text-gray-500 hover:text-gray-700',
        ].join(' ')}
      >
        {props.label}
      </button>
    )
  },
})
