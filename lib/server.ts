import * as http from 'http';
import ConsumeResponse, { Response } from './wrapper/response';
import { Controller, Middleware, Route, ServerOptions } from './@types/index';

/** A ConsumeServer */
export interface ConsumeServer {
  /**
   * Use a middleware function in the server processing pipeline
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
   * Starts the http server listening on the port supplied in the
   * options, or 3000 if not supplied
   * @param {void} callback An optional callback function
   */
  start(callback?: () => void): void;
}

class Server {
  /** The actual server */
  private server: http.Server;

  /** The options that configure the server */
  private serverOptions: ServerOptions;

  /** The defined routes */
  private routes: Route[] = [];

  private middleware: Middleware[] = [];

  constructor(options: ServerOptions = { port: 3000 }) {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    if (options.useSecureHeaders) {
      this.buildHeaders();
    }
  }

  private buildHeaders() {
    this.use((request: http.IncomingMessage, response: Response, controller: Controller) => {
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('X-Frame-Options', 'SAMEORIGIN');
      controller(request, response);
    });
  }

  public listen(port: number, callback?: () => void): void {
    this.server.listen(port, callback);
  }

  private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    const method = request.method?.toLowerCase();
    console.log(method);
    const wrappedResponse: Response = new ConsumeResponse(response);
    const controller = this.routes.get(request.url || '') || this.defaultController;
    this.runMiddleware(0, request, wrappedResponse, controller(request, wrappedResponse));
  }

  private runMiddleware(
    index: number,
    request: http.IncomingMessage,
    response: Response,
    next: () => void
  ) {
    if (index < this.middleware.length) {
      this.middleware[index](request, response, () =>
        this.runMiddleware(index + 1, request, response, next)
      );
    } else {
      next();
    }
  }

  public use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  public get(endpoint: string, callback: Controller) {
    this.routes.set(endpoint, callback);
  }

  // public post(endpoint: string, callback: Controller) {
  //   this.routes.post.set(endpoint, callback);
  // }

  // public put(endpoint: string, callback: Controller) {
  //   this.routes.put.set(endpoint, callback);
  // }

  private defaultController(req: http.IncomingMessage, res: http.ServerResponse) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  public start(callback: () => void) {
    this.server.listen(this.serverOptions.port, callback);
  }
}

const createServer = (options?: ServerOptions): Server => new Server(options);

export default createServer;
