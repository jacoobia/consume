import * as http from 'http';
import ConsumeResponse from './wrapper/response';
import {
  ConsumeServer,
  Controller,
  Middleware,
  EndpointDefinition,
  ServerOptions,
  Response,
  Request,
  StatusCodes,
  ConsumeRoute
} from './@types/index';
import ConsumeRequest from './wrapper/request';
import security from './security/securityMiddleware';
import { isMiddleware } from './util/function';

class Server implements ConsumeServer {
  /** The actual server */
  private server: http.Server;

  /** The options that configure the server */
  private serverOptions: ServerOptions;

  /** The defined endpoints */
  private endpoints: EndpointDefinition[] = [];

  /** The defined middlewares */
  private middleware: Middleware[] = [];

  constructor(options: ServerOptions = { port: 3000 }) {
    this.serverOptions = options;
    this.server = http.createServer(
      (request: http.IncomingMessage, response: http.ServerResponse) =>
        this.handleRequest(request, response)
    );

    //Inject the basic security headers
    if (options.useSecureHeaders) {
      security(this);
    }
  }

  /**
   * Wrap the request and response with the easy-use Consumer API wrapped,
   * run the middleware process and process down the pipeline to the target
   * function
   * @param {http.IncomingMessage} request The incoming request
   * @param {http.ServerResponse} response The outgoing response
   */
  private handleRequest(request: http.IncomingMessage, response: http.ServerResponse): void {
    const method: string = request.method!;
    const url: string = request.url!.split('?')[0];

    const wrappedRequest: Request = new ConsumeRequest(request, this.serverOptions.logRequests);
    const wrappedResponse: Response = new ConsumeResponse(response);

    wrappedRequest.parse().then((success: boolean) => {
      if (!success) {
        return wrappedResponse.reply(StatusCodes.BadRequest, { message: 'Malformed JSON body' });
      }

      for (const route of this.endpoints) {
        const { isMatch, params } = this.matchRoute(url, route.endpoint);
        if (isMatch && route.method === method) {
          wrappedRequest.urlParams = params;
          this.runMiddleware(0, wrappedRequest, wrappedResponse, route);
          return;
        } else if (isMatch) {
          this.methodMismatchRejection(url, method, route.method, wrappedResponse);
          return;
        }
      }

      this.undefinedRejection(url, method, wrappedResponse);
    });
  }

  /**
   * Uses ad route definition endpoint pattern to
   * such as /users/:id/profile to match an incoming
   * request and extract any tokens
   * @param {string} requestedUrl The url from the request
   * @param {string} routePattern The route pattern
   * @returns
   */
  private matchRoute(
    requestedUrl: string,
    routePattern: string
  ): { isMatch: boolean; params: { [key: string]: string } } {
    const requestedParts = requestedUrl.split('/');
    const patternParts = routePattern.split('/');
    const params: { [key: string]: string } = {};

    if (requestedParts.length !== patternParts.length) {
      return { isMatch: false, params };
    }

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].substring(1);
        params[paramName] = requestedParts[i];
      } else if (requestedParts[i] !== patternParts[i]) {
        return { isMatch: false, params };
      }
    }

    return { isMatch: true, params };
  }

  /**
   * Recursively runs through the available middlewares and chain executes them,
   * then finally passes it onto the controller
   * @param {number} index The index of the middleware to run
   * @param {Request} request The incoming incoming
   * @param {Response} response The wrapped response
   * @param {EndpointDefinition} route The route definition to forward the request onto
   */
  private runMiddleware(
    index: number,
    request: Request,
    response: Response,
    route: EndpointDefinition
  ): void {
    if (index < this.middleware.length) {
      this.middleware[index](request, response, () =>
        this.runMiddleware(index + 1, request, response, route)
      );
    } else {
      if (route.preflight) {
        route.preflight(request, response, route.controller);
      } else route.controller(request, response);
    }
  }

  /**
   * If the endpoint definition doesn't exist, we want to handle it
   * gracefully rather than throwing an exception
   * @param {string} url The target endpoint
   * @param {string} method The HTTP Method type
   * @param {Response} response The request object to send
   */
  private undefinedRejection(url: string, method: string, response: Response): void {
    response.reply(StatusCodes.NotFound, { message: `No definition for ${method}:${url}` });
  }

  /**
   * If the endpoint definition exists but the method does not match,
   * the incoming request we want to handle it gracefully rather than
   * throwing an exception
   * @param {string} url The target endpoint
   * @param {string} requestedMethod The HTTP Method type requested
   * @param {string} requiredMethod The HTTP Method type required
   * @param {Response} response The request object to send
   */
  private methodMismatchRejection(
    url: string,
    requestedMethod: string,
    requiredMethod: string,
    response: Response
  ): void {
    response.reply(
      StatusCodes.MethodNotAllowed,
      `Could not ${requestedMethod} ${url}, use ${requiredMethod} instead`
    );
  }

  public use(middleware: Middleware): void {
    this.middleware.push(middleware);
  }

  public route(root: string, route: ConsumeRoute): void {
    route.getRoutes().forEach((endpoint: EndpointDefinition) => {
      this.endpoints.push({
        method: endpoint.method,
        endpoint: `${root}${endpoint.endpoint}`,
        controller: endpoint.controller,
        preflight: endpoint.preflight
      });
    });
  }

  public get(
    endpoint: string,
    preflightOrController: Middleware | Controller,
    controller?: Controller
  ): void {
    this.endpoints.push({
      method: 'GET',
      endpoint,
      ...(isMiddleware(preflightOrController)
        ? { preflight: preflightOrController as Middleware, controller: controller as Controller }
        : { controller: preflightOrController as Controller })
    });
  }

  public post(
    endpoint: string,
    preflightOrController: Middleware | Controller,
    controller?: Controller
  ): void {
    this.endpoints.push({
      method: 'POST',
      endpoint,
      ...(isMiddleware(preflightOrController)
        ? { preflight: preflightOrController as Middleware, controller: controller as Controller }
        : { controller: preflightOrController as Controller })
    });
  }

  public start(callback: () => void): void {
    this.server.listen(this.serverOptions.port, callback);
  }
}

const createServer = (options?: ServerOptions): Server => new Server(options);

export default createServer;
