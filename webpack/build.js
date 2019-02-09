/** @format */

require('dotenv').config();

const buildTarget = process.env.BUILD_TARGET.trim();

const config = require('./baseConfig')(buildTarget);

config.mode = 'production';

module.exports = config;
