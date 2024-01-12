import * as http from 'http';
import { Request, RequestBody, UrlParams } from '../@types';
import { parseBody, parseSearchParams } from '../data/inbound';

class ConsumeRequest implements Request {
  private request: http.IncomingMessage;

  public searchParams: UrlParams;
  public urlParams: UrlParams;
  public body: RequestBody;

  private logRequests: boolean;

  constructor(request: http.IncomingMessage, logRequests: boolean = false) {
    this.request = request;
    this.logRequests = logRequests;
    this.searchParams = {};
    this.urlParams = {};
    this.body = {};
  }

  public parseBody<T>(): T {
    return this.body as T;
  }

  public parseUrlParams<T>(): T {
    return this.urlParams as T;
  }

  public parseSearchParams<T>(): T {
    return this.searchParams as T;
  }

  public async parse(): Promise<boolean> {
    try {
      this.searchParams = parseSearchParams(this.fullUrl());
      const parsedBody: RequestBody = await parseBody(this.request);
      this.body = parsedBody;
      this.requestLogging();
    } catch (error: unknown) {
      return false;
    }
    return true;
  }

  private requestLogging() {
    if (this.logRequests) {
      const message = {
        url: this.fullUrl(),
        endpoint: this.request.url!,
        method: this.request.method!,
        source: this.request.socket.remoteAddress,
        headers: this.request.headers,
        searchParams: this.searchParams,
        urlParam: this.urlParams,
        body: this.body
      };
      console.log(message);
    }
  }

  public getCookie(name: string): string {
    const cookies = this.request.headers.cookie;
    if (!cookies) return undefined;

    const cookieValue = cookies.split(';').find((cookie) => cookie.trim().startsWith(`${name}=`));
    return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : undefined;
  }

  public getAllCookies(): Record<string, string> {
    const cookies = this.request.headers.cookie;
    const cookiesObj: Record<string, string> = {};

    if (cookies) {
      cookies.split(';').forEach((cookie) => {
        const [name, value] = cookie.split('=').map((c) => c.trim());
        cookiesObj[decodeURIComponent(name)] = decodeURIComponent(value);
      });
    }

    return cookiesObj;
  }

  public fullUrl(): string {
    const url: string | undefined = this.request.url;
    const req: http.IncomingMessage = this.request;
    return url ? `http://${req.headers.host}${req.url}` : '';
  }
}

export default ConsumeRequest;
