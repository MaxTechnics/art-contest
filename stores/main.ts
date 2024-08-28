import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', () => {
    const user_info = ref(null);
    const user_guild_info = ref(null);
    const user_status = ref(null);

    return { user_info, user_guild_info, user_status };
})
