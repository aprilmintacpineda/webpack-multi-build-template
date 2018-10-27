# What this is

This repository serves as a demonstration and also a template for projects that require different builds for multiple environments using webpack.

It starts out with web, native, and mobile using [inferno-js](https://github.com/infernojs/inferno). But you can certainly modify it to use [react](https://github.com/facebook/react) or anything really. The repository is already setup for development and production.

# Code formatting

For code formatting the template is using [eslint](https://github.com/eslint/eslint) and [prettier](https://github.com/prettier/prettier).

#### NPM scripts

- To run eslint `npm run eslint`.
- To run prettier `npm run prettier`.
- To run both in the proper order `npm run lint`.

# Getting started

1. Clone the repository.
2. `npm i`
3. `npm run start` -- A browser will open.
4. `npm run build` -- to build for production. Your files would be at `builds/`.
