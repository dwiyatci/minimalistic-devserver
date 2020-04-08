/**
 * Created by glenn on 05.08.16.
 * Last updated on 09.04.20.
 */

const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const config = {
    mode: eitherDevOrProd('development', 'production'),
    devtool: 'source-map',
    output: {
      filename: eitherDevOrProd('[name].js', '[name].[contenthash].js'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            // https://webpack.js.org/loaders/babel-loader
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          // use: ['style-loader', 'css-loader'],
          // use: ExtractTextPlugin.extract({
          //   use: 'css-loader',
          //   fallback: 'style-loader',
          // }),
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: 'url-loader?limit=8192',
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),

      // Code Splitting - CSS
      // new ExtractTextPlugin(eitherDevOrProd('[name].css', '[name].[chunkhash].css')),
      new MiniCssExtractPlugin({
        filename: eitherDevOrProd('[name].css', '[name].[chunkhash].css'),
      }),

      // Caching
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        favicon: './src/favicon.ico',
      }),
    ],
    optimization: {
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: 'single',
    },
    devServer: {
      contentBase: resolve(__dirname, 'dist'),
      compress: true,
      noInfo: false,
      historyApiFallback: true,
      https: true,
    },
  };

  return config;

  function eitherDevOrProd(devStuff, prodStuff) {
    return env && env.production ? prodStuff : devStuff;
  }
};
