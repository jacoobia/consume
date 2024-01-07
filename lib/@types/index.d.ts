export type Header = string | number | string[];

/** The methods to support */
export type HttpMethod = 'GET' | 'POST' | 'PUT';

/** An object of search params */
export type UrlParams = { [key: string]: string };

/** A body json object */
export type RequestBody = { [key: string]: string | number | boolean };

/** A controller function */
export type Controller = (request: Request, response: Response) => void;

/** A function passed down the chain in the middleware process */
export type ChainedFunction = () => void | Controller;

/** A middleware function */
export type Middleware = (request: Request, response: Response, controller: Controller) => void;

/** Optional Settings for a Consume server */
export type ServerOptions = {
  port: number;
  useSecureHeaders?: boolean;
  logRequests?: boolean;
};

/** The definitions of a route */
export type RouteDefinition = {
  endpoint: string;
  method: HttpMethod;
  controller: Controller;
};

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
  /**
   * Sends a message back to the client a request came from
   * @param statusCode The HTTP status code for the response
   * @param body The body to send back to the clinet
   */
  reply(statusCode: number, body: unknown): void;

  /**
   * Set a header for a http response for a client
   * @param {string} name The name of the header
   * @param {Header} value The value to set the header to
   */
  setHeader(name: string, value: Header): void;
}

export interface Request {
  /**
   * The URL search params if they exist
   */
  searchParams: UrlParams;

  urlParams: UrlParams;

  /**
   * The Request body if it exists
   */
  body: RequestBody;

  /**
   * Parses the request data (body, query, param etc)
   */
  parse(): Promise<void>;

  /**
   * Returns the full URL including the host
   */
  fullUrl(): string;
}
