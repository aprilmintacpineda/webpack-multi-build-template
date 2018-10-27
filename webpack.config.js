import webpack from "webpack";
import path from "path";
import HTMLWebpackPlugin from "html-webpack-plugin";

export default [
  {
    name: "WEB",
    mode: "development",
    bail: true,
    entry: path.join(__dirname, "/src/web/entry.js"),
    output: {
      filename: "js/main.js",
      chunkFilename: "js/[name].js",
      path: path.resolve(__dirname, "builds/web")
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: path.join(__dirname, "/public/index.html"),
        path: path.resolve(__dirname, "/builds/web/index.html"),
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
            loader: "babel-loader"
          }
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    devServer: {
      host: "0.0.0.0",
      port: 3000,
      open: true
    }
  }
];
