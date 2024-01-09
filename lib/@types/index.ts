/** Possible header types */
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

/** Common HTTP Status Codes */
export const StatusCodes = {
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  Conflict: 409,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504
};
/** Optional Settings for a Consume server */
export type ServerOptions = {
  port: number;
  useSecureHeaders?: boolean;
  logRequests?: boolean;
};

/** The definition of a route */
export type RouteDefinition = {
  root: string;
  route: ConsumeRoute;
};

/** The definitions of an endpoint */
export type EndpointDefinition = {
  endpoint: string;
  method: HttpMethod;
  controller: Controller;
  preflight?: Middleware;
};

/** A validator */
export type ElementValidator = {
  validate: (object: unknown) => boolean;
  optional?: boolean;
};

/** Options for validators */
export type ValidatorOptions = {
  noExtraElements?: boolean;
  errorListName?: string;
};

/** A validation functopn */
export type ValidatorFunction = (() => ElementValidator) & { optional: () => ElementValidator };

/** Validation error response */
export type ValidatorError = Record<string, string>;

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
   * Adds a the endpoints that a route is responsible for to the
   * primary endpoint list, this is because routes are simply a
   * developer helper to group endpoints
   * @param {string} root The root of the route
   * @param {ConsumeRoute} route The route to add
   */
  route(root: string, route: ConsumeRoute): void;

  /**
   * Define a handler for GET requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Middleware} preflight A personal preflight for this endpoint
   * @param {Controller} controller The function to handle the GET request
   */
  get(endpoint: string, preflight: Middleware, controller: Controller): void;

  /**
   * Define a handler for GET requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Controller} controller The function to handle the GET request
   */
  get(endpoint: string, controller: Controller): void;

  /**
   * Define a handler for POST requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Middleware} preflight A personal preflight for this endpoint
   * @param {Controller} controller The function to handle the POST request
   */
  post(endpoint: string, preflight: Middleware, controller: Controller): void;

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

export interface ConsumeRoute {
  /**
   * Define a handler for GET requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Middleware} preflight A personal preflight for this endpoint
   * @param {Controller} controller The function to handle the GET request
   */
  get(endpoint: string, preflight: Middleware, controller: Controller): void;

  /**
   * Define a handler for GET requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Controller} controller The function to handle the GET request
   */
  get(endpoint: string, controller: Controller): void;

  /**
   * Define a handler for POST requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Middleware} preflight A personal preflight for this endpoint
   * @param {Controller} controller The function to handle the POST request
   */
  post(endpoint: string, preflight: Middleware, controller: Controller): void;

  /**
   * Define a handler for POST requests to a specific endpoint
   * @param {string} endpoint The endpoint for which the handler is defined
   * @param {Controller} controller The function to handle the POST request
   */
  post(endpoint: string, controller: Controller): void;

  /**
   * Returns the endpoints defined in this Route instance
   * @returns {EndpointDefinition[]} The routes
   */
  getRoutes(): EndpointDefinition[];
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
   * A shorthand function to just reject a request with a 403
   * @param {string} reason the reason message to send
   */
  forbidden(reason?: string): void;

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

  /**
   * The URL params
   * i.e /users/:id
   */
  urlParams: UrlParams;

  /**
   * The Request body if it exists
   */
  body: RequestBody;

  /**
   * Parses the body to a T type
   */
  parseBody<T>(): T;

  /**
   * Parses the URL params to a T type
   */
  parseUrlParams<T>(): T;

  /**
   * Parses the search params to a T type
   */
  parseSearchParams<T>(): T;

  /**
   * Internal use only
   * Parses the request data (body, query, param etc)
   */
  parse(): Promise<boolean>;

  /**
   * Returns the full URL including the host
   */
  fullUrl(): string;
}
