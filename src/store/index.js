import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      count: 0,
      userInto: {
        name: '',
        account: '',
      }
    }
  },

  mutations: {
    UserInto(state, value) {
      console.log('UserInto被调用了');
      state.userInto.name = value.nickName
      state.userInto.account = value.loginUserName
    },
    JIA(state) {
      console.log('JIA被调用了');
      state.count++
    },
    NAME(state, value) {
      state.userInto.name = value
    }
  }
})