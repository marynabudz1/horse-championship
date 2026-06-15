import { defineComponent } from 'vue'
import HomeView      from './views/HomeView'
import ErrorBoundary from './components/ui/ErrorBoundary'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <ErrorBoundary>
        <HomeView />
      </ErrorBoundary>
    )
  },
})
