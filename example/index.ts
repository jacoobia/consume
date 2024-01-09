import { createServer, ConsumeServer } from '../dist';
import userRoute from './controller/userController';

/**
 * Define the server
 */
const server: ConsumeServer = createServer({
  port: 3000,
  useSecureHeaders: true,
  logRequests: false
});

/**
 * An example use of routes to logically separate endpoints
 */
server.route('/users', userRoute);

/**
 * Start the server
 */
server.start(() => {
  console.log('Test API is live!');
});
