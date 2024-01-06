import * as http from 'http';
import { ConsumeServer, Response } from '../lib';
import createServer from '../lib/server';

const server: ConsumeServer = createServer({
  port: 3000
});

server.get('/test', (request: http.IncomingMessage, response: Response) => {
  response.reply(200, { message: Math.random() });
});

server.start(() => {
  console.log('Test API is live!');
});
