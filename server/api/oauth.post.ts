import { serverSupabaseServiceRole } from '#supabase/server'
import type { OauthSuccess } from '../utils/handleOauthCall';
export default defineEventHandler(async (event) => {
    interface OauthPostBody {
        oauthcode: string
    }

    const body: OauthPostBody = await readBody(event);

    const config = useRuntimeConfig();
    const supabase = serverSupabaseServiceRole(event);
    const session = await useSession(event, {
        password: config.sessionServerToken
    })

    console.log('Body:', body);
    try {
        const oauth = await handleOauthCall(body.oauthcode);
        const userInfo = await handleUserInfo((oauth as OauthSuccess).oauthData, event);
        await session.update({ tokens: (oauth as OauthSuccess).oauthData });

        console.log('DO WE GET HERE?')

        const { data, error } = await supabase.from(config.supabaseAnalyticsTable).insert({ event_name: 'user_log_in', info: userInfo });
        if (error) console.error(error);
        console.log('Analytics logging in data:', data);

        return userInfo;
    } catch (e) {
        setResponseStatus(event, 418);
        console.error('oauth post catch... why', e);
        return e;
    }

    console.error('This should not be reached');
});



// app.post('/oauth', async (req, res) => {
//     console.log(req.body.oauthcode);
//     handleOauthCall(req.body.oauthcode).then(oauth => {
//         handleUserInfo(oauth.oauthData).then(async result => {
//             req.session.tokens = oauth.oauthData;
//             res.send(result);

//             const { data, error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'user_log_in', info: result }]);
//             if (error) console.error(error);
//             console.log('Analytics logging in data:', data);

//         }).catch(e => {
//             req.session.destroy();
//             res.status(403).send(e);
//         });
//     }).catch(e => {
//         res.status(418).send(e);
//     });
// });
