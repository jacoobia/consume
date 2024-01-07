import { UrlParams } from '../@types';
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

export const parseBody = () => {};
