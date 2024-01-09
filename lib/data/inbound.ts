import { RequestBody, UrlParamMatch, UrlParams } from '../@types';
import * as http from 'http';
import * as url from 'url';

/**
 * Takes in the full url including host from a request and
 * extracts any params that exist within it
 * @param {string} requestUrl The url for the request
 * @returns
 */
export const parseSearchParams = (requestUrl: string): UrlParams => {
  const searchUrl = new url.URL(requestUrl);
  const searchParams = searchUrl.searchParams;
  const data: UrlParams = {};
  searchParams.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};

/**
 * Parses the body of an incoming HTTP request.
 * @param {http.IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<RequestBody>} A promise that resolves to the parsed request body.
 */
export const parseBody = (request: http.IncomingMessage): Promise<RequestBody> => {
  return new Promise((resolve, reject) => {
    let parsed: RequestBody = {};
    let body = '';
    request.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        if (body.length > 0) parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error: unknown) {
        reject(error);
      }
    });

    request.on('error', (error: unknown) => {
      reject(error);
    });
  });
};

/**
 * Uses a route definition endpoint pattern to
 * such as /users/:id/profile to match an incoming
 * request and extract any tokens and checks if it's
 * a match to the incoming request pattern
 *
 * Should be names matchAndParseUrlParams but that's too long lol
 *
 * @param {string} requestedUrl The url from the request
 * @param {string} routePattern The route pattern
 * @returns {UrlParamMatch} The result of the match attempt
 */
export const parseUrlTokens = (requestedUrl: string, routePattern: string): UrlParamMatch => {
  const urlSegments = requestedUrl.split('/');
  const patternSegments = routePattern.split('/');

  if (urlSegments.length !== patternSegments.length) {
    return { isMatch: false, params: {} };
  }

  const params: { [key: string]: string } = {};

  for (let i = 0; i < patternSegments.length; i++) {
    if (patternSegments[i].startsWith(':')) {
      // Extract parameter
      const paramName = patternSegments[i].substring(1);
      params[paramName] = urlSegments[i];
    } else if (urlSegments[i] !== patternSegments[i]) {
      // Static segment doesn't match
      return { isMatch: false, params: {} };
    }
  }

  return { isMatch: true, params };
};
