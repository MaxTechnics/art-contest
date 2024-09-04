<template>
    <!-- <WaitView v-if="$config.preVoteOpen !== 'true'" /> -->
    <!-- <div v-else> -->
    <Loading v-if="loading" :message="loadingState" />
    <RequestLogin v-if="requestLogin" />
    <ErrorView v-if="unsuccessful" :message="errormessage" :problematic="has_error" @button_click="startArt" />
    <ArtList v-if="!loading && !unsuccessful && !requestLogin" />
    <!-- </div> -->
</template>

<script setup>
import ArtList from '@/views/ArtList.vue';
import ErrorView from '@/views/ErrorView.vue';
import Loading from '@/views/Loading.vue';
import RequestLogin from '@/views/RequestLogin.vue';
import WaitView from '@/views/WaitView.vue';
import submissions from '@/assets/submissions.js';
import { onMounted } from 'vue';
import { useFetch } from 'nuxt/app';
import { useMainStore } from '../stores/main';
import { useRoute } from 'vue-router';

const loading = ref(true);
const loadingState = ref('Loading app');
const count = ref(0);
const requestLogin = ref(false);
const unsuccessful = ref(false);
const errormessage = ref('');
const has_error = ref(false);
const mainstore = useMainStore();
const theroute = useRoute();
const router = useRouter();

const handleOauth = async () => {
    console.log('route', (theroute))
    const queryCode = theroute.query.code;
    // const queryCode = $route.query.code;
    loadingState.value = 'Loading session';
    const { data, error } = await useFetch('/api/session');


    console.log('handleoauth client data error', data.value, error.value)

    clearQuery();
    if (error.value) {
        setTimeout(() => {
            loadingState.value = 'No active session';
        }, 100);
        setTimeout(() => {
            if (queryCode) return logInWithCode(queryCode);
            loading.value = false;
            requestLogin.value = true;
        }, 200);
    } else {
        mainstore.user_info = data.value.user_data.member;
        // $store.commit('setUserGuildInfo', data.user_data.guild);
        // $store.commit('setUserStatus', { can_vote: data.value.can_vote });
        mainstore.user_status = { can_vote: data.value.can_vote };
        if (!data.value.can_vote) {
            unsuccessful.value = true;
            errormessage.value = data.value.message;
            loading.value = false
        }
        if (data.value.can_vote) startArt()
    }

    // get code param from url
    // do the thing (also if possible remove the param to keep the url clean.)
    // If that fails
    // get server info from session if exists (might be there)
    // if that fails, no session exists 
};

const logInWithCode = (oauthcode) => {
    loadingState.value = 'Logging in with code'
    fetch('/api/oauth', {
        method: 'POST',
        body: JSON.stringify({ oauthcode }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    }).then(async res => {
        clearQuery();
        const responseJSON = await res.json();
        if (res.status !== 200) {
            unsuccessful.value = true;
            errormessage.value = responseJSON.message;
            has_error.value = true;
            loading.value = false;
        } else {
            // $store.commit('setUserInfo', responseJSON.user_data.member);
            // $store.commit('setUserGuildInfo', responseJSON.user_data.guild);
            // $store.commit('setUserStatus', { can_vote: responseJSON.can_vote });
            mainstore.user_info = responseJSON.user_data.member;
            mainstore.user_status = { can_vote: responseJSON.can_vote };
            if (!responseJSON.can_vote) {
                unsuccessful.value = true;
                errormessage.value = responseJSON.message;
                loading.value = false
            }
            if (responseJSON.can_vote) startArt()
        }
    })
};

const startArt = () => {
    loading.value = true;
    unsuccessful.value = false;
    animateValue(0, submissions.length, (submissions.length * 30));
    setTimeout(() => {
        loading.value = false;
    }, (submissions.length * 30 + 100))
}

const animateValue = (start = 0, end = 0, duration = 800) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;

        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        loadingState.value = `Loading ${Math.floor(progress * (end - start) + start)} submissions`

        // if not at end, continue
        // if at end, return final number WITHOUT math operation to preserve decimals
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
};

const clearQuery = () => {
    console.log(('query stuff', theroute.query))
    // $router.replace({ query: {} });
    // theroute.query = {};
    // theroute.query.code = '';
    router.replace({ query: {} });
}

onMounted(() => {
    setTimeout(() => {
        handleOauth();
        // startArt();
    }, 400);
});


useHead({
    script: [
        { src: '/masonry.pkgd.min.js' },
        { src: '/modernizr-custom.js' },
        { src: '/imagesloaded.pkgd.min.js' },
        { src: '/confettprep.js' },
        { src: '/confett.js', defer: true }
    ],
    link: [
        { rel: 'icon', type: 'image/gif', href: '/jdn.gif' },
    ]
})
</script>
