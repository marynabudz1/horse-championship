import { defineComponent, ref, onErrorCaptured } from 'vue'

export default defineComponent({
  name: 'ErrorBoundary',
  setup(_, { slots }) {
    const error   = ref<Error | null>(null)
    const message = ref<string>('')

    onErrorCaptured((err: unknown) => {
      error.value   = err instanceof Error ? err : new Error(String(err))
      message.value = error.value.message
      return false // stop propagation
    })

    function handleRetry(): void {
      error.value   = null
      message.value = ''
    }

    return () => {
      if (error.value) {
        return (
          <div class="flex flex-col items-center justify-center h-full w-full gap-4 p-8 text-center">
            <div class="text-5xl">🐎</div>
            <h2 class="text-xl font-bold text-gray-800">Something went wrong</h2>
            <p class="text-sm text-gray-500 max-w-sm">{message.value || 'An unexpected error occurred.'}</p>
            <button
              onClick={handleRetry}
              class="px-4 py-2 bg-[#e85d5d] text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )
      }

      return slots.default?.()
    }
  },
})
