import { createApp } from 'vue'
import App from './App'
import store, { key } from './store'
import './assets/main.css'

const app = createApp(App)

app.config.errorHandler = (err, _instance, info) => {
  console.error('[App error]', info, err)
}

app.use(store, key).mount('#app')
