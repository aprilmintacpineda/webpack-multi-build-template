/** @format */

import path from 'path';
import postcssPresetEnv from 'postcss-preset-env';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const webOutputDir = path.resolve(__dirname, '../builds/web');
const webEntryFile = path.join(__dirname, '../src/web/entry.js');

const nativeOutputDir = path.resolve(__dirname, '../builds/native');
const nativeEntryFile = path.join(__dirname, '../src/native/entry.js');

export default [
  {
    name: 'WEB',
    mode: 'production',
    bail: true,
    entry: webEntryFile,
    output: {
      filename: 'js/main.js',
      chunkFilename: 'js/[name].js',
      path: webOutputDir
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      }),
      new OptimizeCssAssetsWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: path.join(__dirname, '../public/index.html'),
        path: webOutputDir,
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
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  {
    name: 'NATIVE',
    mode: 'production',
    bail: true,
    entry: nativeEntryFile,
    output: {
      filename: 'js/main.js',
      chunkFilename: 'js/[name].js',
      path: nativeOutputDir
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      }),
      new OptimizeCssAssetsWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: path.join(__dirname, '../public/index.html'),
        path: nativeOutputDir,
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
      splitChunks: {
        chunks: 'all'
      }
    }
  }
];
