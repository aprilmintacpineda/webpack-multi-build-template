/** @format */

import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const nativeOutputDir = path.resolve(__dirname, 'builds/native');
const nativeEntryFile = path.join(__dirname, 'src/native/entry.js');

export default {
  name: 'NATIVE',
  mode: 'development',
  bail: true,
  entry: nativeEntryFile,
  output: {
    filename: 'js/main.js',
    chunkFilename: 'js/[name].js',
    path: nativeOutputDir
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
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
    port: 9100,
    open: true
  }
};
