export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const session = await useSession(event, {
        password: config.sessionServerToken
    });

    await session.clear();

    return { message: 'bai' }
});
