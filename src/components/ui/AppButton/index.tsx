import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'AppButton',
  props: {
    label:    { type: String   as PropType<string>,                required: true },
    variant:  { type: String   as PropType<'primary' | 'secondary'>, default: 'primary' },
    disabled: { type: Boolean  as PropType<boolean>,               default: false },
    onClick:  { type: Function as PropType<() => void>,            required: true },
  },
  setup(props) {
    return () => {
      const base    = 'inline-flex items-center justify-center font-bold uppercase tracking-wider border-2 transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-2.5 py-1 text-xs md:px-4 md:py-2 md:text-sm'
      const variant = props.variant === 'secondary'
        ? 'bg-transparent text-white border-white hover:bg-white hover:text-gray-900'
        : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'

      return (
        <button class={`${base} ${variant}`} disabled={props.disabled} onClick={props.onClick}>
          {props.label}
        </button>
      )
    }
  },
})
