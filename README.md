<!-- @format -->

# The idea

Imagine that you have a **hybrid application** that runs on different platforms. You have one for ios, android, and desktop. You also have desktop web and mobile web version. But all these different platforms running on different devices as **hybrid applications** share SOME or maybe A LOT of source codes, how would you handle this sharing and how would you build for them?

This template solves that by separating codes specific for each platform and having a directory for codes *shared* across these platforms.

## Problems I've encountered

1. Relative paths when importing.

```js
import { aHelperFunc } from 'path/to/some/module';
```

You can think of the `path/to/some/module` to be something like `../../../helpers` or `../../shared/helpers`. This can get daunting real quick. This template solves this problem by making use of `alias` offered by webpack. Using aliases, paths like `../../../helpers` can quickly turn into `_helpers` and paths like `../../shared/helpers` can quickly turn into `_shared/helpers`.

2. A share code rely on a module that is specific for each platform.

Say you have a helper function called `createHuman` that basically creates a random `Human` object. BUT that `Human` object is specific for each platform. How would the shared helper function `createHuman` know where to pull in that `Human` object? Simple, by referencing what I call `self`.

```js
import { Human } from '_self/classes/Human';
```

The `_self/classes/Human` would resolve to `src/{platform}/classes/Human` where `{platform}` is the current platform we are building for. `src/web/classes/Human` for `web` platform, `src/ios/classes/Human` for `ios` platform, `src/android/classes/Human` for `android`, `src/desktop/classes/Human` for `desktop` platform.

3. Deep Sharing

There would be instances where only a little bit of codes, say 5%, would only be different between two, or even more, platforms. To handle this, you'll have to introduce another layer of sharing and make use of the `self`.

# Getting started

1. Clone the repository.
2. `npm i`
3. `npm run start` -- to start development. This will open a browser.
4. `npm run build` -- to build for production. Your files would be at `builds/`.

# Dot Env

## Environment variables

Environment variables defined in `.env` file would be available as the `process.env` global object. You should prefix them with `APP_`, e.g., `APP_TEST_VAR="some value"`, which would be available via `process.env.APP_TEST_VAR`.

All env variables are being parse to their native data type. Example:

```
APP_BOOL="true"
APP_TEST_OBJ='{"test1":"value1","test2":"value2","test3":true,"test4":["hello",123,123.56]}'
APP_ARR='["hello",123,123.56]'
```

- `APP_BOOL` will be available as `process.env.APP_BOOL` which would be a `Boolean`.
- `APP_OBJ` will be available as `process.env.APP_TEST_OBJ` which would be an `Object`.
- `APP_ARR` will be available as `process.env.APP_ARR` which would be an `Array`.

All `process.env.APP_VAR` instances are being replaced, i.e.:

**input**: `console.log(process.env.APP_TEST_OBJ)`
**output**: `console.log({"test1":"value1","test2":"value2","test3":true,"test4":["hello",123,123.56]})`

## WEBSITE_NAME

Is being used for the title in your `index.html`.

## BUILD_TARGET

This is only used in `npm run start` command.

This is being use to determine the directory of where the sources are and where the build would be. You should name this according to the folder name of your source inside the `src` directory. In this case, there's a `web` directory there where the source for the web build is. You would also see the `entry.js` there, this is important as this is what the config would look at first to build your app.

You can also specify `PORT` and `HOST`. Example:

```
HOST="dev.domain.loc"
PORT="3000"
```

This is where your app would be accessible during development.

## BUILD_TARGETS

This is only used in `npm run build` command to build all environments in parallel.

This should be a comma separated string of all the folder names inside the `src` directory where there's an `entry.js` file. E.g.: `BUILD_TARGETS="aDirectory,anotherDirectory,oneMoreDirectory"`. There should be no trailing spaces and slashes.

# Build

## Inlined with index.html

By default, the `main.css` is inline with `index.html`. Babel runtime is also split into a separate chunk that's also inlined.

## Scripts

The vendors script and the main script are split and are loaded via async. This improves loading performance on browsers.

# PWA

The template is PWA enabled by default. Service worker is powered by [workbox](https://github.com/GoogleChrome/workbox).

Dummy icons are available in `public/icons` (16x16, 24x24, 32x32, 64x64, 128x128, 256x256, 512x512).

Manifest file is also available at `public/manifest.json` which the `index.html` already links to.

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
