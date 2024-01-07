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
    this.readBody();
  }

  public async parse(): Promise<void> {
    this.searchParams = parseSearchParams(this.fullUrl());
    await this.readBody();
    this.requestLogging();
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
  }

  private readBody(): Promise<void> {
    return new Promise((resolve, reject) => {
      let body = '';
      this.request.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      this.request.on('end', () => {
        try {
          this.body = JSON.parse(body);
          resolve();
        } catch (e) {
          console.error('Error parsing JSON:', e);
          reject(e);
        }
      });

      this.request.on('error', (err) => {
        console.error('Error reading the request body:', err);
        reject(err);
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
