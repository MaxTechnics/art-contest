import { createStore } from 'vuex';

export default createStore({
	state: { // Never directly edit these, but pull the info with store.state
		test: false,
		user_info: null,
		user_guild_info: null,
		user_status: null
	},
	mutations: { // Call these mutations with store.commit
		setTest(state, payload) {
			state.test = payload;
		},
		setUserInfo(state, payload) {
			state.user_info = payload;
		},
		setUserGuildInfo(state, payload) {
			state.user_guild_info = payload;
		},
		setUserStatus(state, payload) {
			state.user_status = payload;
		}
	},
	actions: { // Call these actions with store.dispatch
		async doTest({ commit, dispatch }) {
			commit('setTest', true);
		}
	},
	// We might not need this as i pull straight from state and getters are not reactive
	getters: {
		testIsTrue: (state) => {
			return state.test;
		}
	}
	// modules: {
	// }
});
