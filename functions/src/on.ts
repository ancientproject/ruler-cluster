import * as express from 'express';
import { HttpsFunction, https, Request } from 'firebase-functions';

export default (handler: (req: Request, resp: express.Response) => void): HttpsFunction => {
    function proxy(req: Request, resp: express.Response) {
        resp.setHeader("X-Rune-Engine", "Gateway");
        handler(req, resp);
    }
    return https.onRequest(proxy);
}
    