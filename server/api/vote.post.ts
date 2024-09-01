import { serverSupabaseServiceRole } from '#supabase/server';

// { choice: preview_id.value }
interface VotePostBody {
    choice: string
}

export default defineEventHandler(async (event) => {
    const body: VotePostBody = await readBody(event);
    const config = useRuntimeConfig();
    const supabase = serverSupabaseServiceRole(event);
    const session = await useSession(event, {
        password: config.sessionServerToken
    });

    // console.log('confighurayschuion', config)
    console.log('session', session.data)
    try {
        const user = await handleUserInfo(session.data.tokens, event);

        const { data, error } = await supabase.from(config.supabaseAnalyticsTable).insert({ event_name: 'pre_vote_data_pull', info: user });
        if (error) console.error(error);

        // handle vote
        try {
            const resp = await handleVote(event, user, body.choice)
            return resp;
        } catch (error) {
            setResponseStatus(event, 418);
            return error;
        }
    } catch (error) {
        session.clear();
        setResponseStatus(event, 403);
        return error;
    }

    // app.post('/vote', async (req, res) => {
    //     handleUserInfo(req.session.tokens).then(async result => {
    //         const { data, error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'pre_vote_data_pull', info: result }]);
    //         if (error) console.error(error);

    //         handleVote(result, req.body.choice).then(response => {
    //             res.send(response);
    //         }).catch(response => {
    //             res.status(418).send(response);
    //         });
    //     }).catch(e => {
    //         req.session.destroy();
    //         res.status(403).send({ message: e });
    //     });
    // });
});
