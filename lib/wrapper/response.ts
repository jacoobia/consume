import * as http from 'http';

export interface Response {
  reply(statusCode: number, body: JSON): void;
  setHeader(name: string, value: string | number | readonly string[]): void;
}

class ConsumeResponse implements Response {
  private response: http.ServerResponse;

  constructor(response: http.ServerResponse) {
    this.response = response;
  }

  public reply(statusCode: number, body: JSON): void {
    this.response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    this.response.end(JSON.stringify(body));
  }

  public setHeader(name: string, value: string | number | readonly string[]): void {
    this.response.setHeader(name, value);
  }
}
export default ConsumeResponse;
