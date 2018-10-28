/** @format */

import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const rootDir = path.resolve(__dirname, 'builds/web');

export default [
  {
    name: 'WEB',
    mode: 'development',
    bail: true,
    entry: path.join(__dirname, '/src/web/entry.js'),
    output: {
      filename: 'js/main.js',
      chunkFilename: 'js/[name].js',
      path: rootDir
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: path.join(__dirname, '/public/index.html'),
        path: rootDir,
        filename: 'index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new CopyWebpackPlugin([{ from: path.join(__dirname, 'public'), ignore: ['index.html'] }])
    ],
    module: {
      rules: [
        {
          test: /\.js/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss/,
          use: ['style-loader', 'css-loader', 'sass-loader']
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
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: 'source-map',
    devServer: {
      host: '0.0.0.0',
      port: 3000,
      open: true
    }
  }
];
