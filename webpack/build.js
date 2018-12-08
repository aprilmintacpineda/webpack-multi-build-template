/** @format */

const TerserWebpackPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InlineChunksHTMLWebpackPlugin = require('inline-chunks-html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const workboxWebpackPlugin = require('workbox-webpack-plugin');
const helpers = require('./helpers');

require('dotenv').config();

function configure (buildTarget) {
  const outputDir = path.join(__dirname, '../builds/' + buildTarget);
  const entryFile = path.join(__dirname, '../src/' + buildTarget + '/entry.js');

  return {
    name: buildTarget,
    mode: 'production',
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
          useShortDoctype: true
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
        importWorkboxFrom: 'local',
        skipWaiting: true,
        clientsClaim: true,
        exclude: [/main.[a-zA-Z0-9]+.css/gim],
        swDest: 'serviceWorker.js'
      })
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
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.scss/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.join(__dirname, '../src/shared/styles')]
              }
            },
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
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              // eslint-disable-next-line
              ascii_only: true
            }
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          cache: true,
          sourceMap: false
        }),
        new OptimizeCssAssetsWebpackPlugin()
      ],
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
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      // eslint-disable-next-line
      child_process: 'empty'
    }
  };
}

process.env.NODE_ENV = 'production';

const BUILD_TARGETS = process.env.BUILD_TARGETS.split(',').map(str => str.trim());
const includedEnvs = ['NODE_ENV', 'PUBLIC_PATH'];
const configs = [];

for (let a = 0; a < BUILD_TARGETS.length; a++) {
  configs.push(configure(BUILD_TARGETS[a]));
}

module.exports = configs;
