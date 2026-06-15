import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { RoundSchedule } from '~/types/race'
import type { Horse } from '~/types/horse'
import ScrollTable from '~/components/ui/ScrollTable'

const ROUND_TABLE_COLUMNS = ['#', 'Name']

export default defineComponent({
  name: 'ProgramPanel',
  props: {
    schedule: { type: Array as PropType<RoundSchedule[]>, required: true },
    horses:   { type: Array as PropType<Horse[]>,         required: true },
  },
  setup(props) {
    function resolveHorseName(horseId: number): string {
      const horse = props.horses.find((entry) => entry.id === horseId)
      return horse ? horse.name : `Horse ${horseId}`
    }

    return () => (
      <div class="flex flex-col h-full border border-gray-300 overflow-hidden">
        <div class="px-3 py-2 font-bold text-sm bg-blue-700 text-white uppercase tracking-wider flex-shrink-0">
          Program
        </div>

        <div class="flex-1 overflow-y-auto">
          {props.schedule.length === 0 ? (
            <p class="p-4 text-xs text-gray-400 italic">No program generated yet.</p>
          ) : (
            props.schedule.map((roundSchedule) => {
              const roundRows: string[][] = roundSchedule.horseIds.map((horseId, slotIndex) => [
                String(slotIndex + 1),
                resolveHorseName(horseId),
              ])

              return (
                <div key={roundSchedule.spec.round} class="mb-1">
                  <div class="px-2 py-1 text-white text-xs font-bold uppercase bg-orange-500">
                    {roundSchedule.spec.label}
                  </div>
                  <ScrollTable
                    columns={ROUND_TABLE_COLUMNS}
                    rows={roundRows}
                    headerClass="bg-orange-50"
                    oddRowClass="bg-orange-50"
                    evenRowClass="bg-white"
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  },
})
