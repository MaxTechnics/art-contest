// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@pinia/nuxt"],
  supabase: {
    redirect: false,
    types: './types/supabase.ts',
  },
  runtimeConfig: {
    botToken: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    guildId: process.env.GUILD_ID,
    newAccountLimitTimestamp: process.env.NEW_ACCOUNT_LIMIT_TIMESTAMP,
    redirectUri: process.env.REDIRECT_URI,
    requiredRole: process.env.REQUIRED_ROLE,
    sessionServerToken: process.env.SESSION_SERVER_TOKEN,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    votedRoleId: process.env.VOTED_ROLE_ID,
    votingOpen: process.env.VOTING_OPEN,
    supabaseTable: process.env.SUPABASE_TABLE,
    supabaseAnalyticsTable: process.env.SUPABASE_ANALYTICS_TABLE,
    // preVoteOpen: process.env.PRE_VOTING_OPEN
    preVoteOpen: 'true'
  }
})
