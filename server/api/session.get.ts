import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const supabase = serverSupabaseServiceRole(event);
    const session = await useSession(event, {
        password: config.sessionServerToken
    });

    console.log('Session:', session);

    if (!session.data.tokens) {
        setResponseStatus(event, 418);
        return { loggedIn: false, message: 'No session active' };
    }

    try {
        const userInfo = await handleUserInfo(session.data.tokens);
        const { data, error } = await supabase.from(config.supabaseAnalyticsTable).insert({ event_name: 'user_pull_session', info: userInfo });
        if (error) console.error(error);

        return userInfo;
    } catch (error) {
        session.clear();
        setResponseStatus(event, 403);
        return error;
    }
});
