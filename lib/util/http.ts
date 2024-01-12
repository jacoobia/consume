import { CookieOptions } from '../@types';

/**
 * Builds a cookie string with the provided key value pair and options
 * @param {string} cookie The cookie key=value pair
 * @param {CookieOptions} options The options for the cookie
 * @returns {string} The built cookie string.
 */
export const buildCookie = (cookie: string, options: CookieOptions): string => {
  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.httpOnly) {
    cookie += '; HttpOnly';
  }
  if (options.secure) {
    cookie += '; Secure';
  }
  if (options.path) {
    cookie += `; Path=${options.path}`;
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  return cookie;
};
