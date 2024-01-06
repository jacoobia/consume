import * as http from 'http';

/** The methods to support */
export type HttpMethod = 'GET' | 'POST' | 'PUT';

/** A controller function */
export type Controller = (request: http.IncomingMessage, response: Response) => void;

/**
 * A ConsumeServer
 */
export interface ConsumeServer {
  /**
   * Allows users to define their own middleware to be run before the
   * incoming request hits an endpoint
   * @param {Middleware} middleware The middleware function to use
   */
  use(middleware: Middleware): void;

  /**
   * If the endpoint definition doesn't exist, we want to handle it
   * gracefully rather than throwing an exception
   * @param {string} url The target 'endpoint'
   * @param {string} method The HTTP Method type
   * @param {Response} response The request object to send
   */
  reject(url: string, method: string, response: Response): void;

  /**
   * Runs through the available middlewares and chain executes them,
   * then finally passes it onto the controller
   * @param {number} index the index of the middleware to run
   * @param {http.IncomingMessage} request The incoming incoming
   * @param {Response} response The wrapped response
   * @param {Controller} controller The controller to forward the request onto
   */
  runMiddleware(
    index: number,
    request: http.IncomingMessage,
    response: Response,
    nextFunction: () => void | Controller
  ): void;

  /**
   * Define a handler for GET requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Controller} controller The function to handle the GET request
   */
  get(endpoint: string, controller: Controller): void;

  /**
   * Define a handler for POST requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Controller} controller The function to handle the POST request
   */
  post(endpoint: string, controller: Controller): void;

  /**
   * Binds the HTTP server to a port and runs a callback
   * function when successful
   * @param {void} callback The callback function
   */
  start(callback?: () => void): void;
}

/**
 * The HTTP response to send back to a client
 */
export interface Response {
  reply(statusCode: number, body: unknown): void;
  setHeader(name: string, value: string | number | readonly string[]): void;
}

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

/** The definitions of a route */
export type RouteDefinition = {
  endpoint: string;
  method: HttpMethod;
  controller: Controller;
};
