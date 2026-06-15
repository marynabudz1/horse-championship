import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'ScrollTable',
  props: {
    columns:      { type: Array   as PropType<string[]>,   required: true },
    rows:         { type: Array   as PropType<string[][]>, required: true },
    swatchColumn: { type: Number  as PropType<number>,     default: -1 },
    headerClass:  { type: String  as PropType<string>,     default: 'bg-gray-100' },
    oddRowClass:  { type: String  as PropType<string>,     default: 'bg-gray-50' },
    evenRowClass: { type: String  as PropType<string>,     default: 'bg-white' },
  },
  setup(props) {
    return () => (
      <div class="overflow-y-auto h-full">
        <table class="w-full text-xs border-collapse">
          <thead class={`sticky top-0 z-10 ${props.headerClass}`}>
            <tr>
              {props.columns.map((columnLabel) => (
                <th key={columnLabel} class="px-2 py-1 text-left font-semibold border-b border-gray-300 whitespace-nowrap">
                  {columnLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.rows.map((rowCells, rowIndex) => (
              <tr key={rowIndex} class={rowIndex % 2 === 0 ? props.evenRowClass : props.oddRowClass}>
                {rowCells.map((cellValue, columnIndex) => (
                  <td key={columnIndex} class="px-2 py-1 border-b border-gray-100 whitespace-nowrap">
                    {columnIndex === props.swatchColumn ? (
                      <span
                        class="inline-block w-4 h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: cellValue }}
                      />
                    ) : (
                      cellValue
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
})
