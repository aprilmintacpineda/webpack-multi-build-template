/** @format */

import path from 'path';
import postcssPresetEnv from 'postcss-preset-env';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import InlineChunksHTMLWebpackPlugin from 'inline-chunks-html-webpack-plugin';
import { config } from 'dotenv';
import chalk from 'chalk';

config();

const BUILD_TARGET = process.env.BUILD_TARGET.trim();

const outputDir = path.join(__dirname, '../builds/' + BUILD_TARGET);
const entryFile = path.join(__dirname, '../src/' + BUILD_TARGET + '/entry.js');

console.log(chalk.yellow('Using'), chalk.magenta(outputDir), chalk.yellow('as output directory.')); // eslint-disable-line
console.log(chalk.yellow('Using'), chalk.magenta(entryFile), chalk.yellow('as entry file.')); // eslint-disable-line
console.log(); // eslint-disable-line

export default {
  name: BUILD_TARGET,
  mode: 'production',
  bail: true,
  entry: entryFile,
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    path: outputDir
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      path: outputDir,
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
    new InlineChunksHTMLWebpackPlugin({
      deleteFile: true,
      inlineChunks: ['runtime.js']
    }),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '../public'), ignore: ['index.html'] }])
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
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    // eslint-disable-next-line
    child_process: 'empty'
  }
};
