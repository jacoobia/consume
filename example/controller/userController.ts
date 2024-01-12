import { ConsumeRoute, Request, Response, StatusCodes, createRoute } from '../../dist';
import { User } from '../@types';
import { addUser, getUserById, getUsers } from '../service/userService';
import { addUserValidator } from '../validation/userValidation';

/**
 * Define the route for the controller
 */
const userRoute: ConsumeRoute = createRoute();

/**
 * An exanple endpoint to fetch all users
 */
userRoute.get('', (request: Request, response: Response) => {
  const users: User[] = getUsers();
  console.log(request.getAllCookies());
  response.setCookie('test', 'test', { secure: true });
  response.reply(StatusCodes.Ok, { users });
});

/**
 * An example endpoint to get a user by their ID
 */
userRoute.get('/:id', (request: Request, response: Response) => {
  const { id } = request.parseUrlParams<{ id: string }>();
  const user: User = getUserById(id);
  response.reply(StatusCodes.Ok, { user });
});

/**
 * An example endpoint to get the age of a user by
 */
userRoute.get('/:id/age', (request: Request, response: Response) => {
  const { id } = request.parseUrlParams<{ id: string }>();
  const user: User = getUserById(id);
  response.reply(StatusCodes.Ok, { [user.firstname]: user.age });
});

/**
 * An example endpoint to add a user to the 'database'
 */
userRoute.post('/add', addUserValidator, (request: Request, response: Response) => {
  const user: User = request.parseBody<User>();
  const success: boolean = addUser(user);
  response.reply(StatusCodes.Ok, {
    message: `${success ? 'User added successfully' : 'User already exists'}`
  });
});

export default userRoute;
