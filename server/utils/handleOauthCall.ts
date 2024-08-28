export interface OauthSuccess {
    loginSuccess: true;
    oauthData: {
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
    };
}

export interface OauthFailure {
    loginSuccess: false;
    message: string;
}

export const handleOauthCall = async (oauthcode: string): Promise<OauthFailure | OauthSuccess> => {
    const runtimeConfig = useRuntimeConfig();
    return new Promise(async (res, rej) => {
        try {
            const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: runtimeConfig.clientId,
                    client_secret: runtimeConfig.clientSecret,
                    code: oauthcode,
                    grant_type: 'authorization_code',
                    redirect_uri: runtimeConfig.redirectUri,
                    scope: 'identify'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
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
