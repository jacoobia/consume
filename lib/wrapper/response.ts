import * as http from 'http';
import { CookieOptions, Response, StatusCodes } from '../@types';
import { buildCookie } from '../util/http';

class ConsumeResponse implements Response {
  private response: http.ServerResponse;

  constructor(response: http.ServerResponse) {
    this.response = response;
  }

  public setCookie(name: string, value: string, options: CookieOptions): void {
    const cookieKey = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    const cookie = buildCookie(cookieKey, options);
    this.setHeader('Set-Cookie', cookie);
  }

  public forbidden(reason: string = 'Forbidden request'): void {
    this.reply(StatusCodes.Forbidden, reason);
  }

  public reply(statusCode: number, body: unknown): void {
    this.response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    this.response.end(JSON.stringify(body));
  }

  public setHeader(name: string, value: string | number | readonly string[]): void {
    this.response.setHeader(name, value);
  }
}

export default ConsumeResponse;
