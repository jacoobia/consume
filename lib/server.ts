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

  private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    // Extract the method
    const method: string = request.method!;
    const url: string = request.url!;
    console.log(`${method} \\${url}`);

    //TODO: wrap the request

    //Wrap the response
    const wrappedResponse: Response = new ConsumeResponse(response);

    this.routes.forEach((route: RouteDefinition) => {
      if (route.endpoint === url) {
        if (route.method === method) {
          this.runMiddleware(
            0,
            request,
            wrappedResponse,
            route.controller(request, wrappedResponse)
          );
          return;
        } else {
          wrappedResponse.reply(500, `Could not ${method} \\${url}`);
        }
      }
    });

    this.reject(url, method, wrappedResponse);
  }

  private runMiddleware(
    index: number,
    request: http.IncomingMessage,
    response: Response,
    nextFunction: () => void | Controller
  ) {
    if (index < this.middleware.length) {
      this.middleware[index](request, response, () =>
        this.runMiddleware(index + 1, request, response, nextFunction)
      );
    } else nextFunction(request, response);
  }

  private reject(url: string, method: string, response: Response) {
    response.reply(404, { message: `No definition for ${method}:${url}` });
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
