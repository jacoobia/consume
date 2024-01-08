import { Controller, Middleware } from '../@types';

/**
 * Counts the params of the function for the following reason:
 *  2 params means it's a controller function
 *    i.e (request, response)
 *  3 params means it's a middleware function
 *    i.e (request, response, controller)
 * @param func
 * @returns
 */
export const isMiddleware = (func: Middleware | Controller): func is Middleware => {
  return func.length === 3;
};
