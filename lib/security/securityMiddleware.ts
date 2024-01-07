import { ConsumeServer, Controller, Response, Request } from '../@types';

export default (server: ConsumeServer) => {
  server.use((request: Request, response: Response, controller: Controller) => {
    response.setHeader(
      'Content-Security-Policy',
      // eslint-disable-next-line quotes
      "default-src 'self'; script-src 'self'; object-src 'none';"
    );
    response.setHeader('X-DNS-Prefetch-Control', 'off');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.setHeader('X-Download-Options', 'noopen');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    controller(request, response);
  });
};
