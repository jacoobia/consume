import { createServer, ConsumeServer, Request, Response, StatusCodes } from '../dist';
import { User } from './@types';
import { addUser, getUsers } from './service/userService';

const server: ConsumeServer = createServer({
  port: 3000,
  useSecureHeaders: true,
  logRequests: true
});

server.get('/users', (request: Request, response: Response) => {
  const users: User[] = getUsers();
  response.reply(StatusCodes.Ok, { users });
});

server.post('/addUser', (request: Request, response: Response) => {
  const user: User = request.parseBody<User>();
  const success: boolean = addUser(user);
  response.reply(StatusCodes.Ok, {
    message: `${success ? 'User added successfully' : 'User already exists'}`
  });
});

server.start(() => {
  console.log('Test API is live!');
});
