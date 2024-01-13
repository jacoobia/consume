import { CookieOptions } from '../../lib';
import { buildCookie } from '../../lib/util/http';

describe('buildCookie', () => {
  it('should build a cookie string with the provided options', () => {
    const cookie = 'myCookie';
    const options: CookieOptions = {
      expires: new Date('2022-12-31'),
      httpOnly: true,
      secure: true,
      path: '/my-path',
      domain: 'example.com',
      sameSite: 'Strict'
    };

    const expectedCookieString =
      'myCookie; Expires=Sat, 31 Dec 2022 00:00:00 GMT; HttpOnly; Secure; Path=/my-path; Domain=example.com; SameSite=Strict';
    const result = buildCookie(cookie, options);

    expect(result).toEqual(expectedCookieString);
  });
});
