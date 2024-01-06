import * as http from 'http';
import { Controller, Middleware, Request, Response, ServerOptions } from './@types/index';

/** A ConsumeServer */
export interface ConsumeServer {
  /**
   * Use a middleware function in the server processing pipeline.
   * @param {Middleware} middleware The middleware function to use.
   */
  use(middleware: Middleware): void;

  /**
   * Define a handler for GET requests to a specific endpoint.
   * @param {string} endpoint The endpoint for which the handler is defined.
   * @param {Controller} controller The function to handle the GET request.
   */
  get(endpoint: string, controller: Controller): void;

  init(callback: () => void): void;
}

class Server implements ConsumeServer {
  private serverOptions: ServerOptions;
  private server: http.Server;
  private routes: Map<string, Controller> = new Map();
  private middleware: Middleware[] = [];

  constructor(options: ServerOptions = { port: 3000 }) {
    this.serverOptions = options;
    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    if (options.useSecureHeaders) {
      this.use((request: Request, response: Response, controller: Controller) => {
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'SAMEORIGIN');
        controller(request, response);
      });
    }
  }

  private handleRequest(request: Request, response: Response) {
    const handler = this.routes.get(request.url || '') || this.defaultHandler;
    this.runMiddleware(0, request, response, () => handler(request, response));
  }

  private runMiddleware(
    index: number,
    request: Request,
    response: Response,
    controller: Controller
  ) {
    if (index < this.middleware.length) {
      this.middleware[index](request, response, () =>
        this.runMiddleware(index + 1, request, response, controller)
      );
    } else {
      controller(request, response);
    }
  }

  public use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  public get(endpoint: string, callback: Controller) {
    this.routes.set(endpoint, callback);
  }

  private defaultHandler(request: Request, res: Response) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  public init(callback: () => void) {
    this.server.listen(this.serverOptions.port, callback);
  }
}

const createServer = (options?: ServerOptions): Server => new Server(options);

export default createServer;
