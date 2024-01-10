import { parseSearchParams, parseUrlTokens } from '../../lib/data/inbound';

describe('parseSearchParams', () => {
  it('should parse search params correctly', () => {
    const requestUrl = 'https://example.com/search?query=apple&category=fruits';
    const expected = {
      query: 'apple',
      category: 'fruits'
    };

    const result = parseSearchParams(requestUrl);

    expect(result).toEqual(expected);
  });

  it('should handle empty search params', () => {
    const requestUrl = 'https://example.com/search';
    const expected = {};

    const result = parseSearchParams(requestUrl);

    expect(result).toEqual(expected);
  });

  it('should handle special characters in search params', () => {
    const requestUrl = 'https://example.com/search?query=hello%20world&category=food%26drink';
    const expected = {
      query: 'hello world',
      category: 'food&drink'
    };

    const result = parseSearchParams(requestUrl);

    expect(result).toEqual(expected);
  });
});

describe('parseUrlTokens', () => {
  it('should match URL segments correctly', () => {
    const requestedUrl = '/users/123';
    const routePattern = '/users/:id';
    const expected = {
      isMatch: true,
      params: {
        id: '123'
      }
    };

    const result = parseUrlTokens(requestedUrl, routePattern);

    expect(result).toEqual(expected);
  });

  it('should handle non-token URL segments', () => {
    const requestedUrl = '/users/123';
    const routePattern = '/users/id';
    const expected = {
      isMatch: false,
      params: {}
    };

    const result = parseUrlTokens(requestedUrl, routePattern);

    expect(result).toEqual(expected);
  });

  it('should handle different number of URL segments', () => {
    const requestedUrl = '/users/123/posts';
    const routePattern = '/users/:id';
    const expected = {
      isMatch: false,
      params: {}
    };

    const result = parseUrlTokens(requestedUrl, routePattern);

    expect(result).toEqual(expected);
  });
});
