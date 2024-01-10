/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, Controller } from '../../lib';
import { isMiddleware } from '../../lib/util/function';

describe('isMiddleware', () => {
  it('should return true if the function has 3 parameters', () => {
    const middlewareFunc = (_request: Request, _response: Response, _controller: Controller) => {};
    expect(isMiddleware(middlewareFunc)).toBe(true);
  });

  it('should return false if the function does not have 3 parameters', () => {
    const controllerFunc = (_request: Request, _response: Response) => {};
    expect(isMiddleware(controllerFunc)).toBe(false);
  });
});
