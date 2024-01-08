import {
  createServer,
  ConsumeServer,
  Request,
  Response,
  StatusCodes,
  Middleware,
  validator,
  StringValidator,
  NumberValidator
} from '../dist';
import { User } from './@types';
import { addUser, getUsers } from './service/userService';

const server: ConsumeServer = createServer({
  port: 3000,
  useSecureHeaders: true,
  logRequests: false
});

const validation: Middleware = validator({
  firstname: StringValidator(),
  surname: StringValidator(),
  age: NumberValidator()
});

server.get('/users', (request: Request, response: Response) => {
  const users: User[] = getUsers();
  response.reply(StatusCodes.Ok, { users });
});

server.post('/addUser', validation, (request: Request, response: Response) => {
  const user: User = request.parseBody<User>();
  const success: boolean = addUser(user);
  response.reply(StatusCodes.Ok, {
    message: `${success ? 'User added successfully' : 'User already exists'}`
  });
});

server.start(() => {
  console.log('Test API is live!');
});
