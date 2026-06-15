import { createStore, useStore as baseUseStore } from 'vuex'
import type { Store } from 'vuex'
import type { InjectionKey } from 'vue'
import type { RootState } from '~/types/store'
import horsesModule from '~/store/modules/horsesModule'
import raceModule   from '~/store/modules/raceModule'

export const key: InjectionKey<Store<RootState>> = Symbol()

const store = createStore<RootState>({
  modules: {
    horses: horsesModule,
    race:   raceModule,
  },
})

export function useStore(): Store<RootState> {
  return baseUseStore(key)
}

export default store
