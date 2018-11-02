<!-- @format -->

# What this is

This repository serves as a demonstration and also a template for projects that require different builds for different environments using webpack.

It starts out with web, native, and mobile using [inferno-js](https://github.com/infernojs/inferno). But you can certainly modify it to use [react](https://github.com/facebook/react) or anything really. The repository is already setup for development and production.

# Getting started

1. Clone the repository.
2. `npm i`
3. `npm run start` -- to start development. This will open a browser.
4. `npm run build` -- to build for production. Your files would be at `builds/`.

# Dot Env

## Environment variables

Environment variables defined in `.env` file would be available as the `env` global object. You should prefix them with `APP_ENV_`, e.g., `APP_ENV_TEST_VAR="some value"`, which would be available via `env.APP_ENV_TEST_VAR`. `PUBLIC_PATH` and `NODE_ENV` are available by default.

#### NOTE

All values defined in `env` global object are **STRINGS**.

## WEBSITE_NAME

## BUILD_TARGET

This is being use to determine the directory of where the source is and where the build would be. You should name this according to the folder name of your source inside the `src` directory. In this case, there's a `web` directory there where the source for the web build is. You would also see the `entry.js` there, this is important as this is what the config would look at first to build your app.

You can also specify `PORT` and `HOST`. Example:

```
HOST="dev.domain.loc"
PORT="3000"
```

This is where your app would be accessible during development.

# Code formatting

For code formatting the template is using [eslint](https://github.com/eslint/eslint) and [prettier](https://github.com/prettier/prettier).

#### NPM scripts

- To run eslint `npm run eslint`.
- To run prettier `npm run prettier`.
- To run both in the proper order `npm run lint`.

# Styling

Only `scss` is used for styling because as of the this writing, [`prettier` does not support `sass`](https://github.com/prettier/prettier/issues/4948).

# Code splitting

You can use [webpack's dynamic import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) _BUT_ it does not work out of the box, you need a bridge like [inferno-async-component](https://github.com/aprilmintacpineda/inferno-async-component) to handle the component.

# Public files

Use the `public` folder on the root directory to store your public files. You can create folders there like `fonts/`, `css/`, `images/` if you have to.

Webpack is configured to save _all css files_ you used in your js files in the `css/` folder of your build, so to avoid having two folders with only css files in them, you can also create `css/` folder in the `public` directory. Those files would be copied in the `css/` directory of the build together with the other css files you may be using, like in [font-awesome](https://www.npmjs.com/package/font-awesome). For the fonts, save them in the `public/fonts/` directory. For `images` save them in the `public/images` directory. For js save them in the `public/js` directory. For svg files, save them in the `public/svgs` directory.

#### Serving built files

You can serve built files after running `npm run build` by running one of the following.

- `npm run serve:web`
- `npm run serve:native`

This feature is powered by [http-server](https://github.com/indexzero/http-server).
