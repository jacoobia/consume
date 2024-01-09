# Consume

> :warning: **This is not a production ready package!** This is in no way a production ready product and is simply just a personal learning/exploratory project. Use at your own risk!

The developmer experience of this wrapper library takes big big big inspiration from [ExpressJS](https://expressjs.com/), which I love and use often.

With that being said, if you want to contribute to the project, feel free to open issues and/or PRs :)

This is an exploratory project to build my own REST app library to consume endpoint requests.
The project is essentially a big wrapper for the [NodeJS HTTP Library](https://nodejs.org/api/http.html#class-httpserverresponse), it supplies a similar developer experience to that of express with a sprinkle of a few extras.

## Goals

### Outline

- Full type definition support
- Easy/clear developer experience
- Fast and bloat-free

### features

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

## Setup for dev

You will need `pnpm` installed.
Once the project is cloned, simply install all of the dependencies

```
pnpm i
```

## Running for local Dev

ConsumeJS comes with a bundled example project under under the `./example/` folder. You can edit this to try out Any new features you're working on and then run it with.

```
pnpm run dev
```
