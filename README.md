# Consume

> :warning: **This is not a production ready package!**
> This is in no way a production ready product and is simply just a personal learning/exploratory project. Use at your own risk!

The developmer experience of this wrapper library takes big big big inspiration from [ExpressJS](https://expressjs.com/), which I love and use often.

With that being said, if you want to contribute to the project, feel free to open issues and/or PRs :)

This is an exploratory project to build my own REST app library to consume endpoint requests.
The project is essentially a big wrapper for the [NodeJS HTTP Library](https://nodejs.org/api/http.html#class-httpserverresponse), it supplies a similar developer experience to that of express with a sprinkle of a few extras.

## To-do

- ~~Consume HTTP requests~~
- ~~Option to populate some default security headers~~
- ~~Request (http.IncomingMessage) wrapper with a simple api~~
- ~~Response (http.ServerResponse) wrapper with a simple api~~
- Support different body formats (JSON, xhr, form da(ta etc)
- ~~In-built scheme validation (can leverage the same method as my [SchemeIt library](https://github.com/jacoobia/schemeit))~~
- In-built Rate limiting
- ~~Middlewares (optionally define them before the controller in the meth functions like ExpressJS)~~
- Sending files in responses not just data
- ~~Root 'routes' allowing logical breakdown of disciplines by files~~
- ~~Body data~~
- ~~Search params i.e /example?foo=bar~~
- ~~URL params i.e /example/:id/profile~~

## Example Usage

```
// Define your server
const server: ConsumeServer = createServer({
  port: 3000,
  useSecureHeaders: true,
  logRequests: false
});

// Define any routes and/or endpoints
server.get('/example', (request: Request, response: Response) => {
  response.reply(StatusCodes.Ok, { message: 'Hello World!' });
});

// Start your server and hit the endpoint!
server.start(() => {
  console.log('Test API is live!');
});

```

Querying `localhost:3000/example` would yield the following result:

```
{
    "message": "Hello World!"
}
```

## Setup for dev

### Requirements

- PNPM

### Install

Once the project is cloned, simply install all of the dependencies

```
pnpm i
```

### Running for local testing

ConsumeJS comes with a bundled example project under under the `./example/` folder. You can edit this to try out Any new features you're working on and then run it with the following command

```
pnpm run dev
```

This will build the lib under the `./dist/` directory and run the example project, it includes `nodemon` so that you can make changes to the example with hot-reloading, but this will **not** hot-reload the library build.
