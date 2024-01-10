# Consume

> :warning: **This is not a production ready package!** :warning:<br>
> This is in no way a production ready product and is simply just a personal learning/exploratory project. Use at your own risk!

- [:globe_with_meridians: Consume](#consume)
  - [:page_with_curl: Intro](#page_with_curl-intro)
  - [:clipboard: To-do](#clipboard-to-do)
  - [:minidisc: Installing](#minidisc-installing)
  - [:bulb: Example Usage](#bulb-example-usage)
  - [:gear: Setup for dev](#gear-setup-for-dev)
    - [Install Dependencies](#install-dependencies)
    - [Running for local testing](#running-for-local-testing)
    - [Running the test suite](#running-the-test-suite)
  - [:hammer_and_wrench: Quality & Automation](#hammer_and_wrench-quality-automation)
    - [Linting](#linting)
    - [Formatting](#formatting)
    - [Pre-commit](#pre-commit)
    - [Catch-all Command](#catch-all-command)
    - [Build & Release](#build-release)

---

## :page_with_curl: Intro

The developer experience of this wrapper library takes big big big inspiration from [ExpressJS](https://expressjs.com/), which I love and use often. With that being said, if you want to contribute to the project, feel free to open issues and/or PRs. :zap:

This is an exploratory project to build my own REST app library to consume endpoint requests.
The project is essentially a big wrapper for the [NodeJS HTTP Library](https://nodejs.org/api/http.html), it supplies a similar developer experience to that of express with a sprinkle of a few extras. Ingested requests will be wrapped parsed with simple functions to pull out the data and do with it what you need, the servers response will also be wrapped and offered to the developer in the controller with simple functions for replying to requests and sending different flavours of data.

---

## :clipboard: To-do

:white_check_mark: ~~Consume basic HTTP requests~~
:white_check_mark: ~~Option to populate some default security headers~~
:white_check_mark: ~~Request (http.IncomingMessage) wrapper with a simple api~~
:white_check_mark: ~~Response (http.ServerResponse) wrapper with a simple api~~
:white_square_button: Support different body formats in and out (currently just JSON or plain text)
:white_check_mark: ~~In-built scheme validation (can leverage the same method as my [SchemeIt library](https://github.com/jacoobia/schemeit))~~
:white_square_button: In-built Rate limiting
:white_check_mark: ~~Middlewares (optionally define them before the controller in the meth functions like ExpressJS)~~
:white_square_button: Sending files in responses not just data
:white_check_mark: ~~Root 'routes' allowing logical breakdown of disciplines by files~~
:white_check_mark: ~~Body data~~
:white_check_mark: ~~Search params i.e /example?foo=bar~~
:white_check_mark: ~~URL params i.e /example/:id/profile~~
:white_square_button: Client cache validation
:white_square_button: Surface cookies
:white_square_button: Validate if requests are secure (using https, which uses the TLS protocol)
:white_check_mark: ~~Header manipulations~~
:white_square_button: Support for other HTTP request methods besides GET & POST

---

## :minidisc: Installing

```
 > npm install consumejs
```

```
 > pnpm install consumejs
```

```
 > yarn install consumejs
```

---

## :bulb: Example Usage

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

---

## :gear: Setup for dev

**:heavy_exclamation_mark: The project is setup using PNPM, to switch to your preferred package manager delete `pnpm-lock.yaml` and reinstall.**

### Installing Dependencies

Once the project is cloned, simply install all of the dependencies

```
 > pnpm install
```

### Running for local testing

ConsumeJS comes with a bundled example project under under the `./example/` folder. You can edit this to try out Any new features you're working on and then run it with the following command

```
 > pnpm run dev
```

This will build the lib under the `./dist/` directory and run the example project, it includes `nodemon` so that you can make changes to the example with hot-reloading, but this will **not** hot-reload the library build.

### Running the test suite

Tests are stored under `root/__tests__/` in a hierachy that mimics the lib and all extend `.test.ts`, the test suite uses [Jest](https://jestjs.io/) and [ts-jest](https://www.npmjs.com/package/ts-jest). I'm **not** aiming for any level of coverage as at that point I would be writing tests for the sake of coverage and just to have tests instead of tests as insurance for logic. Plus some of the implementations cannot be tested in a meaningful way and should be thoroughly dev-tested.

```
 > pnpm test
```

---

## :hammer_and_wrench: Quality & Automation

### Linting

Linting is configured using [ESLint](https://eslint.org/), you can find the configuration under `.eslintrc.js`. By default it's extending the `eslint:recommended` and `plugin:@typescript-eslint/recommended` with some rules overriden to match my personal preference such as:

- Indentation: 2
- String Quotes: Single
- Semi-colon: Always
- Linebreak: Unix

You can run some linting on the typescript files using:

```
 > pnpm run lint
```

And you can also use eslint to clean up as many problems as it can using:

```
 > pnpm run clean
```

### Formatting

Formatting is done using [Prettier](https://prettier.io/) and is configured to match the ESLint configuration and should be setup to run on file save. However, if this isn't the case don't worry because linting happens as part of the pre-commit phase.

### Pre-commit

[Husky](https://typicode.github.io/husky/) is configured with [lint-staged](https://www.npmjs.com/package/lint-staged) which are both used to enforce some rules as part of the pre-commit phase. This phase will run prettier with the `write` flag, eslint and jest.

### Catch-all Command

For on the fly code quality and linting, feel free to make use of the `quality` command that runs prettier against the lib folder and then lints the output afterwars.

```
 > pnpm run quality
```

### Build & Release

You can build the project using the `build` script but the `relase` script is for the pipeline only and will fail when ran locally.
Building is useful for if you want to work on the example project that lives under `./example/`, which you run using the `dev` script, otherwise it will be run by the pipeline as part of the build and release stage.

```
 > pnpm run build
```
