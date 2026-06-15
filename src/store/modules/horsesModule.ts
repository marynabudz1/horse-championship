import type { Module, MutationTree, ActionTree } from 'vuex'
import type { Horse } from '~/types/horse'
import type { HorsesState, RootState } from '~/types/store'
import { HORSE_NAMES, HORSE_COLORS }   from '~/constants/horses'
import { TOTAL_HORSES }               from '~/constants/race'

const state: HorsesState = {
  horses: [],
}

const mutations: MutationTree<HorsesState> = {
  SET_HORSES(horsesState: HorsesState, horses: Horse[]) {
    horsesState.horses = horses
  },
}

const actions: ActionTree<HorsesState, RootState> = {
  initHorses({ commit }) {
    const generatedHorses: Horse[] = HORSE_NAMES.slice(0, TOTAL_HORSES).map((name, index) => ({
      id:        index + 1,
      name,
      condition: Math.floor(Math.random() * 100) + 1,
      color:     HORSE_COLORS[index],
    }))
    commit('SET_HORSES', generatedHorses)
  },
}

const horsesModule: Module<HorsesState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default horsesModule
