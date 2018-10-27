/** @format */

import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';

const rootDir = path.resolve(__dirname, 'builds/web');

export default [
  {
    name: 'WEB',
    mode: 'production',
    bail: true,
    entry: path.join(__dirname, '/src/web/entry.js'),
    output: {
      filename: 'js/main.js',
      chunkFilename: 'js/[name].js',
      path: rootDir
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      }),
      new OptimizeCssAssetsWebpackPlugin(),
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
      })
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
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.scss/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [postcssPresetEnv()]
              }
            }
          ]
        },
        {
          test: /\.ttf|\.woff2|\.woff|\.eot|\.svg/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
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
    }
  }
];
