import * as http from 'http';
import ConsumeResponse from './wrapper/response';
import {
  ConsumeServer,
  Controller,
  Middleware,
  RouteDefinition,
  ServerOptions,
  Response,
  Request,
  StatusCodes
} from './@types/index';
import ConsumeRequest from './wrapper/request';
import security from './security/securityMiddleware';
import { isMiddleware } from './util/function';

class Server implements ConsumeServer {
  /** The actual server */
  private server: http.Server;

  /** The options that configure the server */
  private serverOptions: ServerOptions;

  /** The defined routes */
  private routes: RouteDefinition[] = [];

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
   * @param {http.IncomingMessage} request the incoming request
   * @param {http.ServerResponse} response the outgoing response
   */
  private handleRequest(request: http.IncomingMessage, response: http.ServerResponse): void {
    const method: string = request.method!; //TODO: Read any url params and store them in the request wrapper
    const url: string = request.url!.split('?')[0]; // Gross inline string manipiulation to account for url?query=params

    const wrappedRequest: Request = new ConsumeRequest(request, this.serverOptions.logRequests);
    const wrappedResponse: Response = new ConsumeResponse(response);

    wrappedRequest.parse().then((success: boolean) => {
      if (!success) {
        return wrappedResponse.reply(StatusCodes.BadRequest, { message: 'Malformed JSON body' });
      }

      for (const route of this.routes) {
        if (route.endpoint === url) {
          if (route.method === method) {
            this.runMiddleware(0, wrappedRequest, wrappedResponse, route);
            return;
          } else {
            this.methodMismatchRejection(url, method, route.method, wrappedResponse);
            return;
          }
        }
      }

      this.undefinedRejection(url, method, wrappedResponse);
    });
  }

  /**
   * Recursively runs through the available middlewares and chain executes them,
   * then finally passes it onto the controller
   * @param {number} index the index of the middleware to run
   * @param {Request} request The incoming incoming
   * @param {Response} response The wrapped response
   * @param {RouteDefinition} route The route definition to forward the request onto
   */
  private runMiddleware(
    index: number,
    request: Request,
    response: Response,
    route: RouteDefinition
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

  private stripUrlParam() {
    //TODO:
  }

  public use(middleware: Middleware): void {
    this.middleware.push(middleware);
  }

  public get(
    endpoint: string,
    preflightOrController: Middleware | Controller,
    controller?: Controller
  ): void {
    this.routes.push({
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
    this.routes.push({
      method: 'POST',
      endpoint,
      ...(isMiddleware(preflightOrController)
        ? { preflight: preflightOrController as Middleware, controller: controller as Controller }
        : { controller: preflightOrController as Controller })
    });
  }

  // public get(endpoint: string, preflightOrController: Middleware | Controller, controller?: Controller): void {
  //   let preflight: Middleware | undefined;
  //   this.routes.push({
  //     method: 'GET',
  //     endpoint,
  //     controller,
  //     preflight
  //   });
  // }

  // public post(endpoint: string, preflight: Middleware = null, controller: Controller): void {
  //   this.routes.push({
  //     method: 'POST',
  //     endpoint,
  //     controller,
  //     preflight
  //   });
  // }

  public start(callback: () => void): void {
    this.server.listen(this.serverOptions.port, callback);
  }
}

const createServer = (options?: ServerOptions): Server => new Server(options);

export default createServer;
