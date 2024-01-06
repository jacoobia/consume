# Consume

This is an exploratory project to build my own REST app library to consume endpoint requests.

## Goals

### Outline

- Full type definition support
- Easy/clear developer experience
- Fast and bloat-free

### Basic features

- Consume HTTP requests
- Option to populate some default security headers
- Support different body formats (JSON, xhr, form da(ta etc)
- Built in scheme validation (can leverage the same method as my (SchemeIt library)[https://github.com/jacoobia/schemeit])
- Rate limiting

## Setup for dev

You will need `pnpm` installed.
Once the project is cloned, simply install all of the dependencies

```
pnpm i
```

## Running for local Dev

There's an example usage class in this repo under the `./example/` folder. You can edit this to try out Aany new features you're working on and then run it with

```
pnpm run dev
```
