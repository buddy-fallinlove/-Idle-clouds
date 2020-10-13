import { createStore } from 'vuex'


export default createStore({
  state: {
    users: null || JSON.parse(localStorage.getItem('user')!),
    currenIndex: 0 || Number(localStorage.getItem('index')!)
  },
  mutations: {
    setUser(state, data) {
      state.users = data
    },
    setIndex(state, data) {
      state.currenIndex = data
    }
  },
  actions: {
  },
  modules: {
  }
})
