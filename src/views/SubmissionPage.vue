<template>
  	<Loading v-if="loading" :message="loadingState" />
    <RequestLogin v-if="requestLogin" />
    <ErrorView v-if="unsuccessful" :message="errormessage" :problematic="has_error" @button_click="startArt" />
    <ArtList v-if="!loading && !unsuccessful && !requestLogin" />
    <!-- <ArtList /> -->
</template>

<script>
import ArtList from './ArtList.vue';
import ErrorView from './ErrorView.vue';
import Loading from './Loading.vue';
import RequestLogin from './RequestLogin.vue';
import submissions from '@/assets/submissions.js';

export default {
	name: 'SubmissionPage',
	components: {
		ArtList,
		ErrorView,
		Loading,
		RequestLogin
	},
	data: () => ({
		loading: true,
		loadingState: 'Loading app',
		count: 0,
		requestLogin: false,
		unsuccessful: false,
		errormessage: '',
		has_error: false
	}),
	methods: {
		handleOauth() {
			const queryCode = this.$route.query.code;
			this.loadingState = 'Loading session';
			fetch('/session').then(async res => {
				const responseJSON = await res.json();
				if (res.status !== 200) {
					this.clearQuery();
					setTimeout(() => {
						this.loadingState = 'No active session';
					}, 100);
					setTimeout(() => {
						if (queryCode) return this.logInWithCode(queryCode);
						this.loading = false;
						this.requestLogin = true;
					}, 200);
				} else {
					this.$store.commit('setUserInfo', responseJSON.user_data.member);
					this.$store.commit('setUserGuildInfo', responseJSON.user_data.guild);
					this.$store.commit('setUserStatus', { can_vote: responseJSON.can_vote });
					if (!responseJSON.can_vote) {
						this.unsuccessful = true;
						this.errormessage = responseJSON.message;
						this.loading = false
					}
					if (responseJSON.can_vote) this.startArt()
				}

				// set store datas
			})

			// get code param from url
			// do the thing (also if possible remove the param to keep the url clean.)
			// If that fails
			// get server info from session if exists (might be there)
			// if that fails, no session exists 
		},
		logInWithCode(oauthcode) {
			this.loadingState = 'Logging in with code'
			fetch('/oauth', {
				method: 'POST',
				body: JSON.stringify({ oauthcode }),
				headers: { 'Content-type': 'application/json; charset=UTF-8' }
			}).then(async res => {
				this.clearQuery();
				const responseJSON = await res.json();
				if (res.status !== 200) {
					this.unsuccessful = true;
					this.errormessage = responseJSON.message;
					this.has_error = true;
					this.loading = false;
				} else {
					this.$store.commit('setUserInfo', responseJSON.user_data.member);
					this.$store.commit('setUserGuildInfo', responseJSON.user_data.guild);
					this.$store.commit('setUserStatus', { can_vote: responseJSON.can_vote });
					if (!responseJSON.can_vote) {
						this.unsuccessful = true;
						this.errormessage = responseJSON.message;
						this.loading = false
					}
					if (responseJSON.can_vote) this.startArt()
				}



			});
		},
		startArt() {
			this.loading = true;
			this.unsuccessful = false;
			this.animateValue(0, submissions.length, (submissions.length * 30));
			setTimeout(() => {
				this.loading = false;
			}, (submissions.length * 30 + 100))

		},
		animateValue(start = 0, end = 0, duration = 800) {
			let startTimestamp = null;
			const step = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;

				const progress = Math.min((timestamp - startTimestamp) / duration, 1);

				this.loadingState = `Loading ${Math.floor(progress * (end - start) + start)} submissions`

				// if not at end, continue
				// if at end, return final number WITHOUT math operation to preserve decimals
				if (progress < 1) window.requestAnimationFrame(step);
			};
			window.requestAnimationFrame(step);
		},
		clearQuery() {
			this.$router.replace({ query: {} });
		}
	},
	mounted() {
		setTimeout(() => {
			this.handleOauth();
		}, 400);
	}
}
</script>
