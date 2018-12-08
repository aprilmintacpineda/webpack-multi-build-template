/** @format */

const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const InlineChunksHTMLWebpackPlugin = require('inline-chunks-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const workboxWebpackPlugin = require('workbox-webpack-plugin');
const helpers = require('./helpers');

require('dotenv').config();

const BUILD_TARGET = process.env.BUILD_TARGET.trim();
const HOST = process.env.HOST.trim();
const PORT = process.env.PORT.trim();

const outputDir = path.join(__dirname, '../builds/' + BUILD_TARGET);
const entryFile = path.join(__dirname, '../src/' + BUILD_TARGET + '/entry.js');

const includedEnvs = ['PUBLIC_PATH'];

module.exports = {
  name: BUILD_TARGET,
  mode: 'development',
  bail: true,
  entry: entryFile,
  output: {
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    path: outputDir
  },
  plugins: [
    new webpack.DefinePlugin({
      env: helpers.mapEnvsToPrimitiveTypes(process.env, includedEnvs)
    }),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      path: outputDir,
      filename: 'index.html',
      title: process.env.WEBSITE_NAME,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css'
    }),
    new InlineChunksHTMLWebpackPlugin({
      deleteFile: true,
      inlineChunks: ['main.css']
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '../public'), ignore: ['index.html'] }]),
    new workboxWebpackPlugin.GenerateSW({
      skipWaiting: true,
      clientsClaim: true,
      exclude: [/main.[a-zA-Z0-9]+.css/gim],
      swDest: 'serviceWorker.js'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'webpack-loader-clean-pragma',
            options: {
              pragmas: [
                {
                  start: '/** @delete */',
                  end: '/** @enddelete */'
                }
              ],
              consoles: {
                warns: true
              }
            }
          }
        ]
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.join(__dirname, '../src/shared/styles')]
            }
          }
        ]
      },
      {
        test: /\.ttf|\.woff2|\.woff|\.eot/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
            publicPath: '/'
          }
        }
      },
      {
        test: /\.gif|\.png|\.jpg|\.jpeg/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
            publicPath: '/'
          }
        }
      },
      {
        test: /\.svg/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'svgs/[name].[ext]',
            publicPath: '/'
          }
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: {
      _shared: path.join(__dirname, '../src/shared')
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    host: HOST,
    port: PORT,
    open: true,
    hot: true,
    overlay: true,
    open: process.env.BUILD_TARGET === 'web',
    writeToDisk: true,
    compress: true,
    publicPath: process.env.PUBLIC_PATH,
    openPage: process.env.PUBLIC_PATH,
    https: process.env.HTTPS === 'true'
  }
};
