interface TokenType {
    access_token: string;
    token_type: string;
}

export interface UserInfo {
    can_vote: boolean;
    message: string;
    user_data: {
        member: {
            id: string;
            username: string;
            discriminator: string;
            avatar: string;
            bot: boolean;
            system: boolean;
            mfa_enabled: boolean;
            locale: string;
            verified: boolean;
            email: string;
            flags: number;
            premium_type: number;
            public_flags: number;
            joined_at: string;
        };
        guild?: {
            user_id: string;
            nick: string;
            roles: string[];
            joined_at: string;
            premium_since: string;
            deaf: boolean;
            mute: boolean;
            pending: boolean;
            permissions: string;
        };
    };
}

export const handleUserInfo = (tokens: TokenType): Promise<UserInfo> => {
    const config = useRuntimeConfig();

    return new Promise(async (res, rej) => {
        console.log(tokens);
        const userResult = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokens.token_type} ${tokens.access_token}`,
            }
        });

        // const guildResult = await fetch(`https://discord.com/api/users/@me/guilds/${config.guildId}/member`, {
        //     headers: {
        //         authorization: `${tokens.token_type} ${tokens.access_token}`,
        //     }
        // });

        const oauthUser = await userResult.json();
        // const oauthUserInGuild = await guildResult.json();
        // console.log(oauthUser, oauthUserInGuild);
        console.log('oauthuser', oauthUser);

        // if (oauthUser.code === 0 || oauthUserInGuild.code === 0) return rej({ message: 'Authenticaton failed, reload to start a new session.' });
        if (oauthUser.code === 0) return rej({ message: 'Authenticaton failed, reload to start a new session.' });
        // if (oauthUser.retry_after || oauthUserInGuild.retry_after) return rej({ message: `Discord is rateliming us, please try again later, about ${Math.ceil(oauthUser.retry_after / 1000 / 60) || Math.ceil(oauthUserInGuild.retry_after / 1000 / 60)} min(s)` });
        if (oauthUser.retry_after) return rej({ message: `Discord is rateliming us, please try again later, about ${Math.ceil(oauthUser.retry_after / 1000 / 60)} min(s)` });
        // if (oauthUserInGuild.code === 10004) return res({ can_vote: false, message: 'You are not in the r/JaidenAnimations server, sorry.', user_data: { member: oauthUser, guild: oauthUserInGuild } });
        if (!config.votingOpen) return res({ can_vote: false, message: 'Voting has closed, thank you for your participation!', user_data: { member: oauthUser } });
        // if (oauthUserInGuild.code) return res({ can_vote: false, message: oauthUserInGuild.message, user_data: { member: oauthUser, guild: oauthUserInGuild } });
        // if (config.newAccountLimitTimestamp && (new Date(config.newAccountLimitTimestamp) <= new Date(oauthUserInGuild.joined_at))) return res({ can_vote: false, message: 'You joined the server too late to vote. This is done to avoid vote manipulation', user_data: { member: oauthUser, guild: oauthUserInGuild } });
        if (config.newAccountLimitTimestamp && (new Date(config.newAccountLimitTimestamp) <= new Date(oauthUser.joined_at))) return res({ can_vote: false, message: 'You joined the server too late to vote. This is done to avoid vote manipulation', user_data: { member: oauthUser } });
        // TODO: new check for if voted
        // FIXME: for good measure
        // if (oauthUserInGuild?.roles?.includes(config.votedRoleId)) return res({ can_vote: false, message: 'You already voted, if you really need to change your vote, contact Grady\'s Physics Homework (aka MaxTechnics)', user_data: { member: oauthUser, guild: oauthUserInGuild } });
        // if (!oauthUserInGuild?.roles?.includes(config.requiredRole)) return res({ can_vote: false, message: 'You need the Crayola role, it unlocks at level 5, go talk in the server a bit and come back later', user_data: { member: oauthUser, guild: oauthUserInGuild } });


        // res({ can_vote: true, message: 'Welcome', user_data: { member: oauthUser, guild: oauthUserInGuild } })
        res({ can_vote: true, message: 'Welcome', user_data: { member: oauthUser } });
    })
};
