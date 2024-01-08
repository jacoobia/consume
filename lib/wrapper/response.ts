import * as http from 'http';
import { Response, StatusCodes } from '../@types';

class ConsumeResponse implements Response {
  private response: http.ServerResponse;

  constructor(response: http.ServerResponse) {
    this.response = response;
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
