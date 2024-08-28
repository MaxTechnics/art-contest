import { serverSupabaseServiceRole } from '#supabase/server';
import type { H3Event } from 'h3';
import type { UserInfo } from './handleUserInfo';

export const handleVote = (event: H3Event, userInfo: UserInfo, vote_choice: string) => {
    const supabase = serverSupabaseServiceRole(event);
    const config = useRuntimeConfig();

    return new Promise(async (res, rej) => {
        console.log('Userinfo:', userInfo);
        // if (!userInfo.can_vote) return rej({ message: 'You already have the voted role, you can\'t vote', maybe_wrong: true }); // TODO we use new check!
        if (!userInfo.can_vote) return rej({ message: 'You already have voted, you can\'t vote again', maybe_wrong: true }); // TODO we use new check!

        const { data, error } = await supabase.from(config.supabaseTable).insert({
            voter_user_id: userInfo.user_data.member.id,
            vote_choice_id: vote_choice,
            user_info_object: userInfo
        }); // add our vote

        console.error(error);
        if (error) {
            const { data: failed_data, error: failed_error } = await supabase.from(config.supabaseAnalyticsTable).insert([{ event_name: 'vote_save_failed', info: { supabase_error: error } }]);
            console.log('vote save failed log:', failed_data, failed_error);
            return rej({ message: 'Failed to write to database', maybe_wrong: false });
        }


        // NOTE: we don't use roles for this contest
        // console.log(guild_id, userInfo.user_data.member.id, voted_role_id);
        // await fetch(`https://discord.com/api/guilds/${guild_id}/members/${userInfo.user_data.member.id}/roles/${voted_role_id}`, {
        //     method: 'PUT',
        //     headers: {
        //         Authorization: `Bot ${bot_token}`,
        //         'X-Audit-Log-Reason': 'Member voted during the first r/jdn art contest'
        //     }
        // }).then(async response => {
        //     if (response.status !== 204) {
        //         const { data: thign, error: that } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_role_add_failed', info: { response: await response.json(), user_info: userInfo } }]);
        //         console.log(thign, that);
        //         return rej({ message: 'Your vote was saved, however your role was not added. Please contact Grady\'s Physics Homework (MaxTechnics)', maybe_wrong: false });
        //     }

        //     const { data: yes, error: no } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_role_add_success', info: { user_info: userInfo } }]);
        //     console.log(yes, no);
        //     res({ message: 'Your vote has been saved, thank you!' });
        // });
        const { data: yes, error: no } = await supabase.from(config.supabaseAnalyticsTable).insert({ event_name: 'vote_add_success', info: { user_info: userInfo } });
        console.log(yes, no);
        res({ message: 'Your vote has been saved, thank you!' });
    });
}

// const handleVote = (userInfo, vote_choice) => {
// 	return new Promise(async (res, rej) => {
// 		const { data: user_already_in_db_data, error: user_already_in_db_error } = await supabase.from(supabase_table).select('voter_user_id').eq('voter_user_id', userInfo.user_data.member.id);
// 		console.log('Userdata already in db', user_already_in_db_data, user_already_in_db_error);

// 		if (!userInfo.can_vote) return rej({ message: 'You already have the voted role, you can\'t vote', maybe_wrong: true });
// 		if (user_already_in_db_error) return rej({ message: 'Failed to check if you are already in the database', maybe_wrong: false });
// 		if (user_already_in_db_data.length !== 0) return rej({ message: 'You are already in the database, you can\'t vote.', maybe_wrong: true });

// 		const { data, error } = await supabase.from(supabase_table).insert([
// 			{
// 				voter_user_id: userInfo.user_data.member.id,
// 				vote_choice_id: vote_choice,
// 				user_info_object: userInfo
// 			}
// 		]); // add our vote

// 		console.error(error);
// 		if (error) {
// 			const { data: failed_data, error: failed_error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_save_failed', info: { supabase_error: error } }]);
// 			return rej({ message: 'Failed to write to database', maybe_wrong: false });
// 		}

// 		console.log(guild_id, userInfo.user_data.member.id, voted_role_id);
// 		await fetch(`https://discord.com/api/guilds/${guild_id}/members/${userInfo.user_data.member.id}/roles/${voted_role_id}`, {
// 			method: 'PUT',
// 			headers: {
// 				Authorization: `Bot ${bot_token}`,
// 				'X-Audit-Log-Reason': 'Member voted during the first r/jdn art contest'
// 			}
// 		}).then(async response => {
// 			if (response.status !== 204) {
// 				const { data: thign, error: that } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_role_add_failed', info: { response: await response.json(), user_info: userInfo } }]);
// 				console.log(thign, that);
// 				return rej({ message: 'Your vote was saved, however your role was not added. Please contact Grady\'s Physics Homework (MaxTechnics)', maybe_wrong: false });
// 			}

// 			const { data: yes, error: no } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_role_add_success', info: { user_info: userInfo } }]);
// 			console.log(yes, no);
// 			res({ message: 'Your vote has been saved, thank you!' });
// 		});
// 	});
// };
