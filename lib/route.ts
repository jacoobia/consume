import { ConsumeRoute, EndpointDefinition, Middleware, Controller } from './@types';
import { isMiddleware } from './util/function';

class Route implements ConsumeRoute {
  private endpoints: EndpointDefinition[] = [];

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

  public getRoutes(): EndpointDefinition[] {
    return this.endpoints;
  }
}

const createRoute = (): ConsumeRoute => new Route();

export default createRoute;
