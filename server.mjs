import { createClient } from '@supabase/supabase-js';
import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs-extra';

import proxy from 'express-http-proxy';
import session from 'express-session';

const config_file = fs.existsSync('./config.json') ? fs.readJsonSync('./config.json') : null;

// Config jaj
const serverPort = process.env.PORT || config_file?.serverPort;
const sessionServerToken = process.env.SESSION_SERVER_TOKEN || config_file?.sessionServerToken;
const useProxy = process.env.USE_PROXY || config_file?.useProxy;
const proxyURL = process.env.PROXY_URL || config_file?.proxyURL;
const client_id = process.env.CLIENT_ID || config_file?.client_id;
const client_secret = process.env.CLIENT_SECRET || config_file?.client_secret;
const bot_token = process.env.BOT_TOKEN || config_file?.bot_token;
const guild_id = process.env.GUILD_ID || config_file?.guild_id;
const voted_role_id = process.env.VOTED_ROLE_ID || config_file?.voted_role_id;
const required_role = process.env.REQUIRED_ROLE || config_file?.required_role;
const new_account_limit_timestamp = process.env.NEW_ACCOUNT_LIMIT_TIMESTAMP || config_file?.new_account_limit_timestamp;
const redirect_uri = process.env.REDIRECT_URI || config_file?.redirect_uri;
const voting_open = process.env.VOTING_OPEN || config_file?.redirect_uri;
const supabase_url = process.env.SUPABASE_URL || config_file?.supabase_url;
const supabase_key = process.env.SUPABASE_KEY || config_file?.supabase_key;
const supabase_table = process.env.SUPABASE_TABLE || config_file?.supabase_table;
const supabase_analytics_table = process.env.SUPABASE_ANALYTICS_TABLE || config_file?.supabase_analytics_table;

const supabase = createClient(supabase_url, supabase_key);

const handleOauthCall = async (oauthcode) => {
	return new Promise(async (res, rej) => {
		try {
			const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: client_id,
					client_secret: client_secret,
					code: oauthcode,
					grant_type: 'authorization_code',
					redirect_uri: redirect_uri,
					scope: 'identify',
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await oauthResult.json();
			console.log(oauthData);
			oauthData.error ? rej({ loginSuccess: false, message: oauthData.error_description }) : res({ loginSuccess: true, oauthData });

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
			rej({ loginSuccess: false, message: 'Something went wrong server side' })
		}
	});
};

const handleUserInfo = (tokens) => {
	return new Promise(async (res, rej) => {
		console.log(tokens);
		const userResult = await fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${tokens.token_type} ${tokens.access_token}`,
			}
		});

		const guildResult = await fetch(`https://discord.com/api/users/@me/guilds/${guild_id}/member`, {
			headers: {
				authorization: `${tokens.token_type} ${tokens.access_token}`,
			}
		});

		const oauthUser = await userResult.json();
		const oauthUserInGuild = await guildResult.json();
		console.log(oauthUser, oauthUserInGuild);

		if (oauthUser.code === 0 || oauthUserInGuild.code === 0) return rej({ message: 'Authenticaton failed, reload to start a new session.' });
		if (oauthUser.retry_after || oauthUserInGuild.retry_after) return rej({ message: `Discord is rateliming us, please try again later, about ${Math.ceil(oauthUser.retry_after / 1000 / 60) || Math.ceil(oauthUserInGuild.retry_after / 1000 / 60)} min(s)` });
		if (oauthUserInGuild.code === 10004) return res({ can_vote: false, message: 'You are not in the r/JaidenAnimations server, sorry.', user_data: { member: oauthUser, guild: oauthUserInGuild } });
		if (!voting_open) return res({ can_vote: false, message: 'Voting has closed, thank you for your participation!', user_data: { member: oauthUser, guild: oauthUserInGuild } });
		if (oauthUserInGuild.code) return res({ can_vote: false, message: oauthUserInGuild.message, user_data: { member: oauthUser, guild: oauthUserInGuild } });
		if (new_account_limit_timestamp && (new Date(new_account_limit_timestamp) <= new Date(oauthUserInGuild.joined_at))) return res({ can_vote: false, message: 'You joined the server too late to vote. This is done to avoid vote manipulateion', user_data: { member: oauthUser, guild: oauthUserInGuild } });
		if (oauthUserInGuild?.roles?.includes(voted_role_id)) return res({ can_vote: false, message: 'You already voted, if you really need to change your vote, contact Grady\'s Physics Homework (aka MaxTechnics)', user_data: { member: oauthUser, guild: oauthUserInGuild } });
		if (!oauthUserInGuild?.roles?.includes(required_role)) return res({ can_vote: false, message: 'You need the Crayola role, it unlocks at level 5, go talk in the server a bit and come back later', user_data: { member: oauthUser, guild: oauthUserInGuild } });


		res({ can_vote: true, message: 'Welcome', user_data: { member: oauthUser, guild: oauthUserInGuild } })
	})
};

const handleVote = (userInfo, vote_choice) => {
	return new Promise(async (res, rej) => {
		const { data: user_already_in_db_data, error: user_already_in_db_error } = await supabase.from(supabase_table).select('voter_user_id').eq('voter_user_id', userInfo.user_data.member.id);
		console.log('Userdata already in db', user_already_in_db_data, user_already_in_db_error);

		if (!userInfo.can_vote) return rej({ message: 'You already have the voted role, you can\'t vote', maybe_wrong: true });
		if (user_already_in_db_error) return rej({ message: 'Failed to check if you are already in the database', maybe_wrong: false });
		if (user_already_in_db_data.length !== 0) return rej({ message: 'You are already in the database, you can\'t vote.', maybe_wrong: true });

		const { data, error } = await supabase.from(supabase_table).insert([
			{
				voter_user_id: userInfo.user_data.member.id,
				vote_choice_id: vote_choice,
				user_info_object: userInfo
			}
		]); // add our vote

		console.error(error);
		if (error) {
			const { data: failed_data, error: failed_error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_save_failed', info: { supabase_error: error } }]);
			return rej({ message: 'Failed to write to database', maybe_wrong: false });
		}

		console.log(guild_id, userInfo.user_data.member.id, voted_role_id);
		await fetch(`https://discord.com/api/guilds/${guild_id}/members/${userInfo.user_data.member.id}/roles/${voted_role_id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bot ${bot_token}`,
				'X-Audit-Log-Reason': 'Member voted during the first r/jdn art contest'
			}
		}).then(async response => {
			if (response.status !== 204) {
				const { data: thign, error: that } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_role_add_failed', info: { response: await response.json(), user_info: userInfo } }]);
				console.log(thign, that);
				return rej({ message: 'Your vote was saved, however your role was not added. Please contact Grady\'s Physics Homework (MaxTechnics)', maybe_wrong: false });
			}

			const { data: yes, error: no } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'vote_role_add_success', info: { user_info: userInfo } }]);
			console.log(yes, no);
			res({ message: 'Your vote has been saved, thank you!' });
		});
	});
};

console.log('Starting...');

const app = express();

app.use(express.json()); // Parses JSON bodies to JS objects
app.use(session({
	secret: sessionServerToken,
	resave: true,
	saveUninitialized: true
})); // Auth sessions
app.use(express.urlencoded({ extended: true })); // Needed for auth thing body parsing

app.get('/session', async (req, res) => {
	if (!req.session.tokens) {
		return res.status(418).send({ loggedIn: false, message: 'No session active' });
	}
	handleUserInfo(req.session.tokens).then(async result => {
		const { data, error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'user_pull_session', info: result }]);
		if (error) console.error(error);
		console.log('Analytics session data:', data);

		res.send(result);
	}).catch(e => {
		req.session.destroy();
		res.status(403).send(e);
	});
});

app.delete('/session', (req, res) => {
	req.session.destroy();
	res.send({ message: 'bai' });
})

app.post('/oauth', async (req, res) => {
	console.log(req.body.oauthcode);
	handleOauthCall(req.body.oauthcode).then(oauth => {
		handleUserInfo(oauth.oauthData).then(async result => {
			req.session.tokens = oauth.oauthData;
			res.send(result);

			const { data, error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'user_log_in', info: result }]);
			if (error) console.error(error);
			console.log('Analytics logging in data:', data);

		}).catch(e => {
			req.session.destroy();
			res.status(403).send(e);
		});
	}).catch(e => {
		res.status(418).send(e);
	});
});


app.post('/vote', async (req, res) => {
	handleUserInfo(req.session.tokens).then(async result => {
		const { data, error } = await supabase.from(supabase_analytics_table).insert([{ event_name: 'pre_vote_data_pull', info: result }]);
		if (error) console.error(error);

		handleVote(result, req.body.choice).then(response => {
			res.send(response);
		}).catch(response => {
			res.status(418).send(response);
		});
	}).catch(e => {
		req.session.destroy();
		res.status(403).send({ message: e });
	});
});

if (useProxy) {
	app.use('/', proxy(proxyURL)); // After loading the other routes, we proxy the vue app
} else {
	app.use(express.static('dist'));
	app.get('*', (req, res) => {
		res.sendFile('dist/index.html', { root: './' });
	});
}

app.listen(serverPort, () => {
	console.log(`Listening to port ${serverPort}!`);
	console.log(`UI: http://127.0.0.1:${serverPort}`);
});

// Error handling stuff to avoid catastrophic crash
process.on('uncaughtException', e => console.error(e.stack));
process.on('unhandledRejection', e => console.error(e));
process.on('warning', e => console.warn(e.stack));
