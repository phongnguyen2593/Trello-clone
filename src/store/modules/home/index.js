
import api from '@/api'
export default {
    namespaced: true,
    state: {
      directories: [],
      card: [],
    },

    getters: {
      //
    },

    mutations: {
      setDirectories(state, directories) {
        state.directories = directories
      },
      setCard(state, card) {
        state.card = card
      }
    },

    actions: {
      getDirectories({ commit }) {
        api.getDirectories().then((response) => {
          commit('setDirectories', response.data)
        })
      }
    
    }
  }