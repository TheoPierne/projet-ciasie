"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const handler_1 = require("../../node_modules/graphql-http/lib/handler");
/**
 * Create a GraphQL over HTTP spec compliant request handler for
 * the express framework.
 *
 * ```js
 * import express from 'express'; // yarn add express
 * import { createHandler } from 'graphql-http/lib/use/express';
 * import { schema } from './my-graphql-schema';
 *
 * const app = express();
 * app.all('/graphql', createHandler({ schema }));
 *
 * app.listen({ port: 4000 });
 * console.log('Listening to port 4000');
 * ```
 *
 * @category Server/express
 */
function createHandler(options, benchmark) {
    const handle = (0, handler_1.createHandler)(options);
    return async function requestListener(req, res) {
        let startTime = process.hrtime();
        try {
            const [body, init] = await handle({
                url: req.url,
                method: req.method,
                headers: req.headers,
                body: () => {
                    if (req.body) {
                        // in case express has a body parser
                        return req.body;
                    }
                    return new Promise((resolve) => {
                        let body = '';
                        req.on('data', (chunk) => (body += chunk));
                        req.on('end', () => resolve(body));
                    });
                },
                raw: req,
                context: { res },
            });
            let jsonBody = JSON.parse(body);
            jsonBody.benchmark = benchmark(startTime);
            res.writeHead(init.status, init.statusText, init.headers).end(JSON.stringify(jsonBody));
            jsonBody = null;
        }
        catch (err) {
            // The handler shouldnt throw errors.
            // If you wish to handle them differently, consider implementing your own request handler.
            console.error('Internal error occurred during request handling. ' +
                'Please check your implementation.', err);
            res.writeHead(500).end();
        }
    };
}
exports.createHandler = createHandler;
