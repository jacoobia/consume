import * as http from 'http';
import { Response } from '../wrapper/response';

/** A controller function */
export type Controller = (request: http.IncomingMessage, response: Response) => void;

/** A middleware function */
export type Middleware = (
  request: http.IncomingMessage,
  response: Response,
  controller: Controller
) => void;

/** Optional Settings for a Consume server */
export type ServerOptions = {
  port: number;
  useSecureHeaders?: boolean;
};

/** The methods to support */
export type HttpMethod = 'GET' | 'POST' | 'PUT';

/** The definitions of a route */
export type Route = {
  [key: string]: Map<HttpMethod, Controller>;
};
