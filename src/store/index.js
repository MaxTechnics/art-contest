import { createStore } from 'vuex';

export default createStore({
	state: { // Never directly edit these, but pull the info with store.state
		user_info: null,
		user_guild_info: null,
		user_status: null
	},
	mutations: { // Call these mutations with store.commit
		setUserInfo(state, payload) {
			state.user_info = payload;
		},
		setUserGuildInfo(state, payload) {
			state.user_guild_info = payload;
		},
		setUserStatus(state, payload) {
			state.user_status = payload;
		}
	}
});
