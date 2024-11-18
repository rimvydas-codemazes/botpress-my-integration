import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'

export const noop = async () => {
};
export default new bp.Integration({
    register: async ({logger}) => {
        /**
         * This is called when an integration configuration is saved.
         * You should use this handler to instanciate ressources in the external service and ensure that the configuration is valid.
         */
        // throw new sdk.RuntimeError('Invalid configuration') // replace this with your own validation logic
        logger.forBot().debug('Executing register');
        await noop();
    },
    unregister: async ({logger}) => {
        /**
         * This is called when a bot removes the integration.
         * You should use this handler to instanciate ressources in the external service and ensure that the configuration is valid.
         */
        // throw new sdk.RuntimeError('Invalid configuration') // replace this with your own validation logic
        logger.forBot().debug('Executing unregister');
        await noop();
    },
    actions: {
        // @ts-ignore
        createTrackableLink: async ({input, ctx}) => {
            const {conversationId, originalLink} = input;
            const {webhookId} = ctx;
            const encodedInformation = btoa(JSON.stringify({conversationId, originalLink}));
            const trackableLink = `https://webhook.botpress.cloud/${webhookId}?rd=${encodedInformation}`;

            return {trackableLink};
        },
    },
    channels: {},
    // @ts-ignore
    handler: async ({req, client}) => {
        // add this code to the handler function
        if (req.path === "" && req.method === "GET" && req.query.startsWith("rd=")) {
            const url = new URL(`https://example.com/?${req.query}`);
            const rd = url.searchParams.get("rd") ?? "";
            const decodedInformation = JSON.parse(atob(rd));
            const conversationId = decodedInformation.conversationId;
            const originalLink = decodedInformation.originalLink;

            // this reports back to the url creator that the link was clicked
            await client.createEvent({
                type: "clickedLink",
                payload: {conversationId, originalLink},
            });

            // this redirects the url-clicker to the original link
            return {
                status: 307,
                headers: {"content-type": "text/html"},
                body: `<http><head><meta http-equiv="Refresh" content="0; URL=${originalLink}" /></head></http>`,
            };
        }
    },
})
