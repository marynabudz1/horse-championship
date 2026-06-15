import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**', 'src/composables/**', 'src/store/**'],
      exclude: [
        'src/views/**',
        'src/assets/**',
        'src/types/**',
        'src/constants/**',
        'src/store/index.ts',       // injection-key wiring, no logic to test
        'src/store/actionTypes.ts', // plain string constants, no logic to test
      ],
      thresholds: {
        statements: 100,
        branches:    92,
        functions:  100,
        lines:      100,
      },
    },
  },
})
