import * as http from 'http';
import { Request, RequestBody, UrlParams } from '../@types';
import { parseSearchParams } from '../data/parse';

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
      await this.readBody();
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

  private readUrlParams(): void {
    //TODO:
    /**
     * A simple way to implement this could be...
     * /example/:id
     * /example/1001
     *
     * 1. Split BOTH by /
     * 2. Find the index of each string begging with : in the endpoint definition
     * 3. Grab the data at that index on the request url
     * 4. Assign the data to a variable of the assigned name (maybe try and parse too)
     */
  }

  /**
   * Reads the data coming through chunk by chunk and appends
   * it to a body variable. Once all chunks have been appended,
   * it gets parsed with JSON
   * @returns {Promise<void>} async promise
   */
  private readBody(): Promise<void> {
    return new Promise((resolve, reject) => {
      let body = '';
      this.request.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      this.request.on('end', () => {
        try {
          if (body.length > 0) this.body = JSON.parse(body);
          resolve();
        } catch (error: unknown) {
          reject(error);
        }
      });

      this.request.on('error', (error: unknown) => {
        reject(error);
      });
    });
  }

  public fullUrl(): string {
    const url: string | undefined = this.request.url;
    const req: http.IncomingMessage = this.request;
    return url ? `http://${req.headers.host}${req.url}` : '';
  }
}

export default ConsumeRequest;
