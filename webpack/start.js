/** @format */

require('dotenv').config();

const buildTarget = process.env.BUILD_TARGET.trim();

const config = require('./baseConfig')(buildTarget);

config.mode = 'development';
config.devtool = 'inline-source-map',
config.devServer = {
  host: process.env.HOST,
  port: process.env.PORT,
  open: true,
  hot: true,
  overlay: true,
  open: buildTarget === 'web',
  writeToDisk: true,
  compress: true,
  publicPath: process.env.PUBLIC_PATH,
  openPage: process.env.PUBLIC_PATH,
  https: process.env.HTTPS === 'true'
};

module.exports = config;
