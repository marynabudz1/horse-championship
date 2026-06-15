import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { CompletedRound, RoundSchedule } from '~/types/race'
import type { Horse } from '~/types/horse'
import ScrollTable from '~/components/ui/ScrollTable'

const ROUND_TABLE_COLUMNS = ['Pos', 'Name']

export default defineComponent({
  name: 'ResultsPanel',
  props: {
    completedRounds: { type: Array as PropType<CompletedRound[]>, required: true },
    schedule:        { type: Array as PropType<RoundSchedule[]>,  required: true },
    horses:          { type: Array as PropType<Horse[]>,          required: true },
  },
  setup(props) {
    function resolveHorseName(horseId: number): string {
      const horse = props.horses.find((entry) => entry.id === horseId)
      return horse ? horse.name : `Horse ${horseId}`
    }

    function resolveRoundLabel(roundIndex: number): string {
      const scheduledRound = props.schedule[roundIndex]
      return scheduledRound ? scheduledRound.spec.label : `Round ${roundIndex + 1}`
    }

    return () => (
      <div class="flex flex-col h-full border border-gray-300 overflow-hidden">
        <div class="px-3 py-2 font-bold text-sm bg-green-700 text-white uppercase tracking-wider flex-shrink-0">
          Results
        </div>

        <div class="flex-1 overflow-y-auto">
          {props.completedRounds.length === 0 ? (
            <p class="p-4 text-xs text-gray-400 italic">No results yet.</p>
          ) : (
            [...props.completedRounds].reverse().map((completedRound) => {
              const resultRows: string[][] = completedRound.results.map((result) => [
                String(result.position),
                resolveHorseName(result.horseId),
              ])

              return (
                <div key={completedRound.roundIndex} class="mb-1">
                  <div class="px-2 py-1 text-white text-xs font-bold uppercase bg-orange-500">
                    {resolveRoundLabel(completedRound.roundIndex)}
                  </div>
                  <ScrollTable
                    columns={ROUND_TABLE_COLUMNS}
                    rows={resultRows}
                    headerClass="bg-green-50"
                    oddRowClass="bg-green-50"
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
