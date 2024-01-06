import * as http from 'http';
import ConsumeResponse from './wrapper/response';
import {
  ConsumeServer,
  Controller,
  Middleware,
  RouteDefinition,
  ServerOptions,
  Response
} from './@types/index';

// TODO: Add routers that allow for sub routes

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
    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    if (options.useSecureHeaders) {
      this.buildHeaders();
    }
  }

  // TODO: Inject HTTP security headers whenever responses are sent
  private buildHeaders() {
    this.use((request: http.IncomingMessage, response: Response, controller: Controller) => {
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('X-Frame-Options', 'SAMEORIGIN');
      controller(request, response);
    });
  }

  /**
   * Wrap the request and response with the easy-use Consumer API wrapped,
   * run the middleware process and process down the pipeline to the target
   * function
   * @param {http.IncomingMessage} request the incoming request
   * @param {http.ServerResponse} response the outgoing response
   */
  private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    // Extract the method
    const method: string = request.method!;
    const url: string = request.url!;

    //TODO: wrap the request

    //Wrap the response
    const wrappedResponse: Response = new ConsumeResponse(response);

    for (const route of this.routes) {
      if (route.endpoint === url) {
        if (route.method === method) {
          this.runMiddleware(0, request, wrappedResponse, route.controller);
          return;
        } else {
          this.methodMismatchRejection(url, method, wrappedResponse);
          return;
        }
      }
    }

    this.undefinedRejection(url, method, wrappedResponse);
  }

  /**
   * Recursively runs through the available middlewares and chain executes them,
   * then finally passes it onto the controller
   * @param {number} index the index of the middleware to run
   * @param {http.IncomingMessage} request The incoming incoming
   * @param {Response} response The wrapped response
   * @param {Controller} controller The controller to forward the request onto
   */
  private runMiddleware(
    index: number,
    request: http.IncomingMessage,
    response: Response,
    controller: Controller
  ) {
    if (index < this.middleware.length) {
      this.middleware[index](request, response, () =>
        this.runMiddleware(index + 1, request, response, controller)
      );
    } else controller(request, response);
  }

  /**
   * If the endpoint definition doesn't exist, we want to handle it
   * gracefully rather than throwing an exception
   * @param {string} url The target endpoint
   * @param {string} method The HTTP Method type
   * @param {Response} response The request object to send
   */
  private undefinedRejection(url: string, method: string, response: Response) {
    console.log('frick');
    response.reply(404, { message: `No definition for ${method}:${url}` });
  }

  /**
   * If the endpoint definition exists but the method does not match,
   * the incoming request we want to handle it gracefully rather than
   * throwing an exception
   * @param {string} url The target endpoint
   * @param {string} method The HTTP Method type
   * @param {Response} response The request object to send
   */
  private methodMismatchRejection(url: string, method: string, response: Response) {
    response.reply(405, `Could not ${method} ${url}`);
  }

  public use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  public get(endpoint: string, controller: Controller) {
    this.routes.push({
      method: 'GET',
      endpoint,
      controller
    });
  }

  public post(endpoint: string, controller: Controller) {
    this.routes.push({
      method: 'POST',
      endpoint,
      controller
    });
  }

  public start(callback: () => void) {
    this.server.listen(this.serverOptions.port, callback);
  }
}

const createServer = (options?: ServerOptions): Server => new Server(options);

export default createServer;
