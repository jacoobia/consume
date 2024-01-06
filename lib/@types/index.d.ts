import * as http from 'http';

/** Incoming Requests */
export type Request = http.IncomingMessage;

/** Outgoing Responses */
export type Response = http.ServerResponse;

/** A controller function */
export type Controller = (request: Request, response: Response) => void;

/** A middleware function */
export type Middleware = (request: Request, response: Response, controller: Controller) => void;

/** Optional Settings for a Consume server */
export type ServerOptions = {
  port: number;
  useSecureHeaders?: boolean;
};
