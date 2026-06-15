import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { Horse } from '~/types/horse'
import ScrollTable from '~/components/ui/ScrollTable'

const COLUMNS = ['Name', 'Cond.', 'Color']
/** Index of the "Color" column — rendered as a swatch by ScrollTable */
const SWATCH_COLUMN_INDEX = 2

export default defineComponent({
  name: 'HorseList',
  props: {
    horses: { type: Array as PropType<Horse[]>, required: true },
  },
  setup(props) {
    const tableRows = computed<string[][]>(() =>
      props.horses.map((horse) => [
        horse.name,
        String(horse.condition),
        horse.color, // passed as-is; ScrollTable renders it as a swatch
      ]),
    )

    return () => (
      <div class="flex flex-col h-full border border-gray-300 overflow-hidden">
        <div class="px-3 py-2 font-bold text-sm bg-yellow-400 text-gray-900 flex-shrink-0">
          Horse List ({props.horses.length})
        </div>
        <ScrollTable
          columns={COLUMNS}
          rows={tableRows.value}
          swatchColumn={SWATCH_COLUMN_INDEX}
          headerClass="bg-yellow-100"
          oddRowClass="bg-yellow-50"
          evenRowClass="bg-white"
        />
      </div>
    )
  },
})
