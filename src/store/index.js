import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters'
// import * as mutations from './mutations'
// import * as actions from './actions'
Vue.use(Vuex)
const state = {
  nickname: null,
  selectTeam: {},
  selectedName: '', //被选中的人
};
const getters = { //实时监听state值的变化(最新状态)
  isAuthenticated(state) { //承载变化的showFooter的值
    return state.nickname ? true : false
  }
};
const mutations = {
  setSelectedName(state, name) { //存储用户的昵称
    state.selectedName = name;
  },
  setUserData(state, name) { //存储用户的昵称
    state.nickname = name;
  },
  getSelectData(state, data) { //被选中的团队对应的成员信息
    state.selectTeam = data;
  }
};
const actions = {
  setName(context, name) {
    context.commit('setUserData', name);
  },
  getSelect(context, data) { //被选中的团队对应的成员信息
    context.commit('getSelectData', data);
  }
};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
export default store
