/** @format */

import webpack from 'webpack';
import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { config } from 'dotenv';

config();

const BUILD_TARGET = process.env.BUILD_TARGET.trim();
const HOST = process.env.host ? process.env.host.trim() : '0.0.0.0';
const PORT = process.env.port ? process.env.port.trim() : 9000;

const outputDir = path.join(__dirname, '../builds/' + BUILD_TARGET);
const entryFile = path.join(__dirname, '../src/' + BUILD_TARGET + '/entry.js');

process.env.NODE_ENV = 'development';

const envs = ['PUBLIC_PATH', 'NODE_ENV'];

export default {
  name: BUILD_TARGET,
  mode: 'development',
  bail: true,
  entry: entryFile,
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    path: outputDir
  },
  plugins: [
    new webpack.DefinePlugin({
      env: Object.keys(process.env).reduce((compiled, key) => {
        if (key.indexOf('APP_ENV_') !== -1 || envs.includes(key)) {
          compiled[key] = JSON.stringify(process.env[key]);
        }

        return compiled;
      }, {})
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
        useShortDoctype: true
      }
    }),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '../public'), ignore: ['index.html'] }])
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
    open: true
  }
};
